export interface ICardInfo {
  cardType: "credit" | "debit";
  cardLast4: "";
  bankName: "";
  currencies: {
    size: 0;
  };
  transactionCount: "";
  lastUsed: "";
  usesApplePay: "";
  availableLimits: "";
}
