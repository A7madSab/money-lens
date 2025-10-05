export interface ISms {
  _id: number;
  thread_id: number;
  address: string;
  date: number;
  date_sent: number;
  protocol: 0 | 1;
  read: 0 | 1;
  status: -1 | 0 | 32 | 64;
  type: 1 | 2 | 3 | 4 | 5 | 6;
  reply_path_present: 0 | 1;
  subject: string;
  body: string;
  locked: 0 | 1;
  sub_id: number;
  error_code: number;
  creator: string;
  seen: 0 | 1;
}

export enum EMessageType {
  transaction = "transaction",
  bankStatement = "bankStatement",
  atmTransaction = "atmTransaction",
  bankPromotion = "bankPromotion",
}

export enum ETransactionCategory {
  refund = "Refund",
  payment = "Payment",
  applePayPayment = "ApplePayPayment",
  internationalPayment = "InternationalPayment",
  instapayPayment = "InstapayPayment",
}

export enum ETransferType {
  incoming = "incoming",
  outgoing = "outgoing",
}

export interface ITransactionSms extends ISms {
  messageType: EMessageType.transaction;
  transactionType: ETransactionCategory;
  transactionDate: string;
  transactionTime: string;
}

export interface IRefundTransactionSms extends ITransactionSms {
  transactionType: ETransactionCategory.refund;
  vendor: string;
  time: string;
  amount: number;
  currency: string;
  cardEnding: number;
}
export interface IApplePayTransactionSms extends ITransactionSms {
  transactionType: ETransactionCategory.applePayPayment;
  vendor: string;
  time: string;
  amount: number;
  currency: string;
  cardEnding: number;
  cardlimit: {
    amount: number;
    currency: string;
  };
}
export interface IPaymentTransactionSms extends ITransactionSms {
  transactionType: ETransactionCategory.payment;
  vendor: string;
  time: string;
  amount: number;
  currency: string;
  cardEnding: number;
  cardlimit: {
    amount: number;
    currency: string;
  };
}
export interface IInternationalTransactionSms extends ITransactionSms {
  transactionType: ETransactionCategory.internationalPayment;
  availableLimit: number;
  vendor: string;
  time: string;
  amount: number;
  currency: string;
  cardEnding: number;
  internationalLimit: {
    amount: number;
    currency: string;
  };
}
export interface IInstapayPaymentTransactionSms extends ITransactionSms {
  transactionType: ETransactionCategory.instapayPayment;
  amount: number;
  currency: string;
  transferType: ETransferType;
  cardEnding: number;
  name: string;
  transferId: string;
}

export interface IBankStatementSms extends ISms {
  messageType: EMessageType.bankStatement;
  month: string;
  year: string;
  cardEnding: string;
  amount: number;
  currency: string;
}
export interface IAtmTransactionSms extends ISms {
  messageType: EMessageType.atmTransaction;
  currency: string;
  amount: number;
  cardEnding: number;
  atm: string;
  transactionDate: string;
  transactionTime: string;
}
export interface IBankPromotionSms extends ISms {
  messageType: EMessageType.bankPromotion;
}

export type IParsedSms =
  | ITransactionSms
  | IBankStatementSms
  | IAtmTransactionSms
  | IBankPromotionSms;

export const ECurrencyMapper: { [key: string]: string } = {
  جم: "EGP",
};

export const EArabicMonthMapper: { [key: string]: string } = {
  ["يناير"]: "01",
  ["فبراير"]: "02",
  ["مارس"]: "03",
  ["أبريل"]: "04",
  ["مايو"]: "05",
  ["يونيو"]: "06",
  ["يوليو"]: "07",
  ["أغسطس"]: "08",
  ["سبتمبر"]: "09",
  ["أكتوبر"]: "10",
  ["نوفمبر"]: "11",
  ["ديسمبر"]: "12",
};
