import React, { FC, useState } from "react";
import {
  IParsedSms,
  EMessageType,
  ETransactionCategory,
  ETransferType,
} from "@money-lens/core";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as Clipboard from "expo-clipboard";

interface IProps {
  msg: IParsedSms;
}

const MessageCard: FC<IProps> = ({ msg }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCopySms = async () => {
    await Clipboard.setStringAsync(msg.body);
    Alert.alert("Copied!", "SMS message copied to clipboard", [
      { text: "OK", style: "default" },
    ]);
  };

  const getMessageTypeLabel = () => {
    switch (msg.messageType) {
      case EMessageType.transaction:
        return "Transaction";
      case EMessageType.atmTransaction:
        return "ATM";
      case EMessageType.bankStatement:
        return "Statement";
      case EMessageType.bankPromotion:
        return "Promotion";
      default:
        return "Message";
    }
  };

  const getMessageTypeColor = () => {
    switch (msg.messageType) {
      case EMessageType.transaction:
        return "#3b82f6";
      case EMessageType.atmTransaction:
        return "#8b5cf6";
      case EMessageType.bankStatement:
        return "#059669";
      case EMessageType.bankPromotion:
        return "#f59e0b";
      default:
        return "#6b7280";
    }
  };

  const renderTransactionDetails = () => {
    if (msg.messageType !== EMessageType.transaction) return null;

    const transaction = msg as any;
    const isRefund = transaction.transactionType === ETransactionCategory.refund;
    const isInstapay =
      transaction.transactionType === ETransactionCategory.instapayPayment;
    const isApplePay =
      transaction.transactionType === ETransactionCategory.applePayPayment;

    const amountColor = isRefund ? "#10B981" : "#EF4444";

    return (
      <>
        {/* Vendor/Name */}
        {(transaction.vendor || transaction.name) && (
          <Text style={styles.merchant}>
            {transaction.vendor || transaction.name}
          </Text>
        )}

        {/* Amount */}
        <View style={styles.amountSection}>
          <Text style={[styles.amount, { color: amountColor }]}>
            {isRefund ? "+" : "-"} {transaction.amount} {transaction.currency}
          </Text>
          {isApplePay && (
            <View style={styles.applePayBadge}>
              <Text style={styles.applePayText}> Pay</Text>
            </View>
          )}
        </View>

        {/* Details Grid */}
        <View style={styles.detailsGrid}>
          {transaction.cardEnding && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Card</Text>
              <Text style={styles.detailValue}>•••• {transaction.cardEnding}</Text>
            </View>
          )}

          {transaction.transactionDate && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>
                {transaction.transactionDate}{" "}
                {transaction.transactionTime || transaction.time}
              </Text>
            </View>
          )}

          {isInstapay && (
            <>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Transfer</Text>
                <Text style={styles.detailValue}>
                  {transaction.transferType === ETransferType.incoming
                    ? "Incoming"
                    : "Outgoing"}
                </Text>
              </View>
              {transaction.transferId && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>ID</Text>
                  <Text style={styles.detailValue}>
                    {transaction.transferId}
                  </Text>
                </View>
              )}
            </>
          )}

          {transaction.cardlimit && (
            <View style={styles.limitSection}>
              <Text style={styles.limitLabel}>Available Limit</Text>
              <Text style={styles.limitAmount}>
                {transaction.cardlimit.amount} {transaction.cardlimit.currency}
              </Text>
            </View>
          )}

          {transaction.internationalLimit && (
            <View style={styles.limitSection}>
              <Text style={styles.limitLabel}>International Limit</Text>
              <Text style={styles.limitAmount}>
                {transaction.internationalLimit.amount}{" "}
                {transaction.internationalLimit.currency}
              </Text>
            </View>
          )}
        </View>
      </>
    );
  };

  const renderAtmDetails = () => {
    if (msg.messageType !== EMessageType.atmTransaction) return null;

    const atm = msg as any;

    return (
      <>
        <View style={styles.amountSection}>
          <Text style={[styles.amount, { color: "#EF4444" }]}>
            -{atm.amount} {atm.currency}
          </Text>
        </View>

        <View style={styles.detailsGrid}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>ATM</Text>
            <Text style={styles.detailValue}>{atm.atm}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Card</Text>
            <Text style={styles.detailValue}>•••• {atm.cardEnding}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date</Text>
            <Text style={styles.detailValue}>
              {atm.transactionDate} {atm.transactionTime}
            </Text>
          </View>
        </View>
      </>
    );
  };

  const renderStatementDetails = () => {
    if (msg.messageType !== EMessageType.bankStatement) return null;

    const statement = msg as any;

    return (
      <View style={styles.detailsGrid}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Amount Due</Text>
          <Text style={[styles.detailValue, { fontWeight: "600" }]}>
            {statement.amount} {statement.currency}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Period</Text>
          <Text style={styles.detailValue}>
            {statement.month}/{statement.year}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Card</Text>
          <Text style={styles.detailValue}>•••• {statement.cardEnding}</Text>
        </View>
      </View>
    );
  };

  const renderPromotionDetails = () => {
    if (msg.messageType !== EMessageType.bankPromotion) return null;

    return (
      <Text style={styles.promotionText} numberOfLines={isExpanded ? undefined : 2}>
        {msg.body}
      </Text>
    );
  };

  const borderColor = getMessageTypeColor();

  return (
    <View style={[styles.card, { borderLeftColor: borderColor }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.sender}>{msg.address}</Text>
        <View style={[styles.badge, { backgroundColor: borderColor }]}>
          <Text style={styles.badgeText}>{getMessageTypeLabel()}</Text>
        </View>
      </View>

      {/* Type-specific content */}
      {renderTransactionDetails()}
      {renderAtmDetails()}
      {renderStatementDetails()}
      {renderPromotionDetails()}

      {/* Action buttons */}
      <View style={styles.actionSection}>
        <TouchableOpacity
          style={styles.detailsBtn}
          onPress={() => setIsExpanded(!isExpanded)}
        >
          <Text style={styles.detailsText}>
            {isExpanded ? "Hide SMS" : "Show SMS"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.copyBtn} onPress={handleCopySms}>
          <Text style={styles.copyText}>Copy</Text>
        </TouchableOpacity>
      </View>

      {/* Expanded SMS */}
      {isExpanded && (
        <View style={styles.smsSection}>
          <Text style={styles.smsLabel}>Original SMS:</Text>
          <View style={styles.smsContent}>
            <Text style={styles.smsText}>{msg.body}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    borderLeftWidth: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sender: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4b5563",
    flex: 1,
    marginRight: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  merchant: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 8,
  },
  amountSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 8,
  },
  amount: {
    fontSize: 18,
    fontWeight: "700",
  },
  applePayBadge: {
    backgroundColor: "#000",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  applePayText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "600",
  },
  detailsGrid: {
    gap: 6,
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 12,
    color: "#374151",
    fontWeight: "500",
  },
  limitSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f0fdf4",
    padding: 6,
    borderRadius: 6,
    marginTop: 4,
  },
  limitLabel: {
    fontSize: 11,
    color: "#059669",
    fontWeight: "500",
  },
  limitAmount: {
    fontSize: 11,
    color: "#059669",
    fontWeight: "600",
  },
  promotionText: {
    fontSize: 13,
    color: "#374151",
    lineHeight: 18,
    marginBottom: 8,
  },
  actionSection: {
    flexDirection: "row",
    gap: 6,
    marginTop: 4,
  },
  detailsBtn: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    flex: 1,
  },
  detailsText: {
    color: "#4b5563",
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
  },
  copyBtn: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  copyText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
  },
  smsSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  smsLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: 6,
  },
  smsContent: {
    backgroundColor: "#f9fafb",
    padding: 10,
    borderRadius: 6,
    borderLeftWidth: 2,
    borderLeftColor: "#3b82f6",
  },
  smsText: {
    fontSize: 12,
    lineHeight: 16,
    color: "#374151",
  },
});

export default MessageCard;
