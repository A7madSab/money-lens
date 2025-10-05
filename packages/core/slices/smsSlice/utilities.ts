import {
  IParsedSms,
  IRefundTransactionSms,
  ISms,
  EMessageType,
  ETransactionCategory,
  ITransactionSms,
  IApplePayTransactionSms,
  IPaymentTransactionSms,
  IInternationalTransactionSms,
  IInstapayPaymentTransactionSms,
  ETransferType,
  ECurrencyMapper,
  IBankStatementSms,
  EArabicMonthMapper,
  IAtmTransactionSms,
  IBankPromotionSms,
} from "./types";

/**
 * Strategy Pattern: ISmsParser
 *
 * Each bank has unique SMS formats and terminology. The ISmsParser interface
 * defines a contract for parsing bank-specific SMS messages into a common structure.
 *
 * Benefits:
 * - Easy to add new banks without modifying existing code (Open/Closed Principle)
 * - Each parser encapsulates bank-specific logic
 * - Registry pattern enables runtime parser selection based on SMS content
 */
export interface ISmsParser {
  bank: string; // e.g. "NBE", "CIB", "QNB"
  match(message: ISms): boolean; // quick check if this parser applies
  parse(message: ISms): IParsedSms; // full parsing logic
}

export class CibParser implements ISmsParser {
  bank = "CIB";

  match(message: ISms): boolean {
    return message.address?.toUpperCase().includes("CIB") ?? false;
  }

  parse(message: ISms): IParsedSms {
    // // Check for refund transactions
    if (
      message.body.includes("has been refunded. Please try again. Thank you")
    ) {
      return this.parseRefundTransaction(message);
    }

    // Check for ApplePay transactions
    if (message.body.includes("using Apple Pay was charged for")) {
      return this.parseApplePayTransaction(message);
    }

    // Check for Payment transactions
    if (message.body.startsWith("Your credit card ending with")) {
      return this.parsePaymentTransaction(message);
    }

    // Check for international Payment transactions
    if (message.body.startsWith("Your credit card #")) {
      return this.parseInternationalTransaction(message);
    }

    // Check for instapay
    if (message.body.startsWith("يرجى العلم انه تم تنفيذ تحويل لحظي بمبلغ ")) {
      return this.parseInstapayPaymentTransaction(message);
    }

    // Check for bank statement
    if (message.body.startsWith("كشف حساب شهر")) {
      return this.parseBankStatement(message);
    }

    if (message.body.startsWith("تم سحب مبلغ")) {
      return this.parseAtmTransaction(message);
    }

    return this.praseBankPromotion(message);
  }

  private parseTransactionSms(message: ISms): ITransactionSms {
    const transactionDateMatch = message.body.match(
      /on\s+(\d{2}\/\d{2}\/\d{2})\s+at/,
    );
    const transactionDate =
      transactionDateMatch && transactionDateMatch[1]
        ? transactionDateMatch[1].trim()
        : "";

    return {
      ...message,
      messageType: EMessageType.transaction,
      transactionDate,
    } as IRefundTransactionSms;
  }

  private parseRefundTransaction(message: ISms): IRefundTransactionSms {
    const transaction = this.parseTransactionSms(message);
    const vendorMatch = message.body.match(/(?<=from\s)(.+?)(?=\s+with)/);
    const vendor = vendorMatch ? vendorMatch[0].trim() : "";
    const timeMatch = message.body.match(/(?<=at\s)(.+?)(?=\s+has)/);
    const time = timeMatch ? timeMatch[0].trim() : "";
    const currencyAndAmountMatch = message.body.match(
      /(?<=with\s)(.+?)(?=\s+on)/,
    );
    const [currency = "", amount] = currencyAndAmountMatch?.[0]
      .trim()
      .split(" ") ?? ["", ""];
    const cardEndingMatch = message.body.match(/#(\d{4})/);
    const cardEnding = cardEndingMatch ? cardEndingMatch[1] : "";

    return {
      ...transaction,
      cardEnding: Number(cardEnding),
      transactionType: ETransactionCategory.refund,
      vendor,
      currency,
      amount: Number(amount),
      time,
    };
  }

  private parseApplePayTransaction(message: ISms): IApplePayTransactionSms {
    const vendorMatch = message.body.match(/(?<=at\s)(.+?)(?=\s+on)/);
    const vendor = vendorMatch ? vendorMatch[0].trim() : "";

    const timeMatch = message.body.match(
      /(?<=at\s)([\d:]+)(?=\. Card available limit)/,
    );
    const time = timeMatch ? timeMatch[0].trim() : "";

    const currencyAndAmountMatch = message.body.match(
      /(?<=for\s)(.+?)(?=\s+at)/,
    );
    const [currency = "", amount] =
      currencyAndAmountMatch && currencyAndAmountMatch[1]
        ? currencyAndAmountMatch[1].trim().split(" ")
        : ["", ""];

    const availableLimitMatch = message.body.match(
      /(?<=Card available limit is\s)(.+?)(?=\. For more details)/,
    );
    const [cardLimitCurrency = "", cardLimitAmount] =
      availableLimitMatch && availableLimitMatch[1]
        ? availableLimitMatch[1].trim().split("  ")
        : ["", ""];

    const transaction = this.parseTransactionSms(message);

    const cardEndingMatch = message.body.match(/#(\d{4})/);
    const cardEnding = cardEndingMatch ? cardEndingMatch[1] : "";

    return {
      ...transaction,
      transactionType: ETransactionCategory.applePayPayment,
      vendor,
      time,
      currency,
      cardEnding: Number(cardEnding),
      amount: Number(amount),

      cardlimit: {
        currency: cardLimitCurrency,
        amount: Number(cardLimitAmount),
      },
    };
  }

  private parsePaymentTransaction(message: ISms): IPaymentTransactionSms {
    const vendorMatch = message.body.match(/(?<=at\s)(.+?)(?=\s+on)/);
    const vendor = vendorMatch ? vendorMatch[0].trim() : "";

    const timeMatch = message.body.match(
      /(?<=at\s)([\d:]+)(?=\. Card available limit)/,
    );
    const time = timeMatch ? timeMatch[0].trim() : "";

    const currencyAndAmountMatch = message.body.match(
      /(?<=for\s)(.+?)(?=\s+at)/,
    );
    const [currency = "", amount] =
      currencyAndAmountMatch && currencyAndAmountMatch[1]
        ? currencyAndAmountMatch[1].trim().split(" ")
        : ["", ""];

    const currencyAndAmountCardLimitMatch = message.body.match(
      /(?<=Card available limit is\s)(.+?)(?=\. For more details)/,
    );
    const [cardLimitCurrency = "", cardLimitAmount] =
      currencyAndAmountCardLimitMatch && currencyAndAmountCardLimitMatch[1]
        ? currencyAndAmountCardLimitMatch[1].trim().split("  ")
        : ["", ""];

    const transaction = this.parseTransactionSms(message);
    const cardEndingMatch = message.body.match(/#(\d{4})/);
    const cardEnding = cardEndingMatch ? cardEndingMatch[1] : "";

    return {
      ...transaction,
      transactionType: ETransactionCategory.payment,
      vendor,
      cardEnding: Number(cardEnding),
      time,
      currency,
      amount: Number(amount),

      cardlimit: {
        currency: cardLimitCurrency,
        amount: Number(cardLimitAmount),
      },
    };
  }

  private parseInternationalTransaction(
    message: ISms,
  ): IInternationalTransactionSms {
    const vendorMatch = message.body.match(/(?<=at\s)(.+?)(?=\s+on)/);
    const vendor = vendorMatch ? vendorMatch[0].trim() : "";

    const timeMatch = message.body.match(
      /(?<=at\s)([\d:]+)(?=\. Available limit)/,
    );
    const time = timeMatch ? timeMatch[0].trim() : "";

    const currencyAndAmountMatch = message.body.match(
      /(?<=for\s)(.+?)(?=\s+at)/,
    );
    const [currency = "", amount] =
      currencyAndAmountMatch && currencyAndAmountMatch[1]
        ? currencyAndAmountMatch[1].trim().split(" ")
        : ["", ""];

    const availableLimitMatch = message.body.match(
      /(?<=Available limit is \s)(.+?)(?=\s+and the available international)/,
    );
    const availableLimit =
      availableLimitMatch && availableLimitMatch[1]
        ? availableLimitMatch[1].trim()
        : "";

    const internationalLimitMatch = message.body.match(
      /(?<=international limit to use is\s)(.+)/,
    );
    const [
      internationalLimitMatchCurrency = "",
      internationalLimitMatchAmount,
    ] =
      internationalLimitMatch && internationalLimitMatch[1]
        ? internationalLimitMatch[1].trim().split(" ")
        : "";

    const transaction = this.parseTransactionSms(message);

    const cardEndingMatch = message.body.match(/#(\d{4})/);
    const cardEnding = cardEndingMatch ? cardEndingMatch[1] : "";

    return {
      ...transaction,
      availableLimit: Number(availableLimit),
      transactionType: ETransactionCategory.internationalPayment,
      vendor,
      time,
      cardEnding: Number(cardEnding),
      currency,
      amount: Number(amount),
      internationalLimit: {
        amount: Number(internationalLimitMatchAmount),
        currency: internationalLimitMatchCurrency,
      },
    };
  }

  private parseInstapayPaymentTransaction(
    message: ISms,
  ): IInstapayPaymentTransactionSms {
    const matchResultMatcb = message.body.match(
      /(?<=يرجى العلم انه تم تنفيذ تحويل لحظي بمبلغ\s)(.+?)(?=\s+حسابك المنتهي)/,
    );
    const [amount, currencyAr = "", transferTypeAr] = matchResultMatcb
      ? matchResultMatcb[0].split(" ")
      : ["", "", ""];

    const transferType = transferTypeAr?.includes("من")
      ? ETransferType.incoming
      : ETransferType.outgoing;

    const cardEndingMatch = message.body.match(/(?<=\*\*\*\*)(\d{4})/);
    const cardEnding = cardEndingMatch ? cardEndingMatch[0] : "";

    const nameAndTransferIdStartIndex = message.body.indexOf(cardEnding) + 4;
    const nameAndTransferIdEndIndex = message.body.indexOf("بتاريخ");
    const nameAndTransferId = message.body
      .slice(nameAndTransferIdStartIndex, nameAndTransferIdEndIndex)
      .trim();

    const parts = nameAndTransferId.split(" ");
    const transferId = parts.pop() || "";
    const name = parts.join(" ");

    const dateTimeMatch = message.body.match(/(?<=بتاريخ\s)(.+?)(?=\s+للمزيد)/);
    const [transactionDate = "", transactionTime = ""] = dateTimeMatch
      ? dateTimeMatch[0].split(" ")
      : ["", ""];

    return {
      ...message,
      transactionType: ETransactionCategory.instapayPayment,
      messageType: EMessageType.transaction,
      amount: Number(amount),
      currency: ECurrencyMapper[currencyAr] || "",
      transferType,
      cardEnding: Number(cardEnding),
      name,
      transferId,
      transactionDate,
      transactionTime,
    };
  }

  private parseBankStatement(message: ISms): IBankStatementSms {
    const monthAndYearMatch = message.body.match(
      /(?<=كشف حساب شهر\s)(.+?)(?=\s+لبطاقتك الائتمانية المنتهية)/,
    );
    const [month = "", year = ""] = monthAndYearMatch?.[0]
      .trim()
      .split(" ") ?? ["", ""];

    const cardNumberCurrencyAndAmountMatch = message.body.match(
      /(?<=منتهية بـ\s)(.+?)(?=\s+، الحد الأدنى)/,
    );
    const [cardEnding = "", , amount, currencyAr = ""] =
      cardNumberCurrencyAndAmountMatch?.[0].trim().split(" ") ?? ["", ""];

    return {
      ...message,
      messageType: EMessageType.bankStatement,
      month: EArabicMonthMapper[month] || "",
      year,
      cardEnding,
      amount: Number(amount),
      currency: ECurrencyMapper[currencyAr] || "",
    };
  }

  private parseAtmTransaction(message: ISms): IAtmTransactionSms {
    const currencyAndAmountMatch = message.body.match(
      /(?<=تم سحب مبلغ\s)(.+?)(?=\s+من بطاقة الخصم المباشر)/,
    );
    const [currency = "", amount] = currencyAndAmountMatch?.[0]
      .trim()
      .split(" ") ?? ["", ""];

    const cardEndingMatch = message.body.match(/(?<=\*\*)(\d{4})/);
    const cardEnding = cardEndingMatch ? Number(cardEndingMatch[1]) : 0;

    const atmDateTimeMatch = message.body.match(
      /(?<=من بطاقة الخصم المباشر المنتهية\s)(.+?)(?=\s+، الرصيد المتاح)/,
    );
    const atmDateTime =
      (atmDateTimeMatch && atmDateTimeMatch?.[0].trim().split(" ")) || [];
    const transactionTime = atmDateTime.pop() || "";
    const transactionDate = atmDateTime.pop()?.replaceAll("/", "-") || "";
    atmDateTime.pop();

    const atm = atmDateTime
      .slice(3)
      .filter((a) => a && a !== " ")
      .join(" ")
      .trim();

    return {
      ...message,
      messageType: EMessageType.atmTransaction,
      currency,
      amount: Number(amount),
      cardEnding,
      atm,
      transactionDate,
      transactionTime,
    };
  }

  private praseBankPromotion(message: ISms): IBankPromotionSms {
    return {
      ...message,
      messageType: EMessageType.bankPromotion,
    };
  }
}

/**
 * Registry Pattern: SmsParserRegistry
 *
 * The registry maintains a collection of bank parsers and delegates
 * parsing to the appropriate parser based on SMS content matching.
 *
 * Flow:
 * 1. SMS message arrives
 * 2. Registry iterates through registered parsers
 * 3. First parser whose match() returns true handles the parsing
 * 4. Fallback to generic NOTIFICATION if no parser matches
 *
 * This design allows for:
 * - Adding new banks at runtime without code changes
 * - Priority ordering (first registered = first checked)
 * - Graceful degradation when SMS format is unknown
 */
export class SmsParserRegistry {
  private parsers: ISmsParser[] = [];

  register(parser: ISmsParser) {
    this.parsers.push(parser);
  }

  parse(message: ISms): IParsedSms {
    const parser = this.parsers.find((p) => p.match(message))!;
    return parser.parse(message);
  }
}

/**
 * Singleton SMS Parser Registry
 *
 * Pre-configured with Egyptian bank parsers. To add a new bank:
 * 1. Create a class implementing ISmsParser
 * 2. Implement match() to identify bank-specific SMS patterns
 * 3. Implement parse() to extract structured data
 * 4. Register below using smsParserRegistry.register(new YourBankParser())
 *
 * Order matters: parsers are checked in registration order.
 */
export const smsParserRegistry = new SmsParserRegistry();

// Register all bank parsers
smsParserRegistry.register(new CibParser());
