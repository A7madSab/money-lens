import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
import * as Clipboard from "expo-clipboard";

interface IProps {
  // Enhanced parsed data
  merchant: string;
  amount: string;
  cardLast4: string;
  usedApplePay: boolean;
  date: string;
  time: string;
  availableLimit: string;
  transactionType: string;
  category: string;
  categoryColor: string;
  link?: string;

  // Optional fallback for raw data
  description?: string;
}

const TransactionCard: React.FC<IProps> = ({
  merchant,
  amount,
  cardLast4,
  usedApplePay,
  date,
  time,
  availableLimit,
  transactionType,
  category,
  categoryColor,
  link,
  description,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isDebit = transactionType === "debit";
  const isCredit = transactionType === "credit";
  const isRefund = transactionType === "refund";

  const handleCopySms = async () => {
    if (description) {
      await Clipboard.setStringAsync(description);
      Alert.alert("Copied!", "SMS message copied to clipboard", [
        { text: "OK", style: "default" },
      ]);
    }
  };

  // Dynamic colors based on transaction type
  const amountColor = isDebit
    ? "#EF4444"
    : isCredit
      ? "#10B981"
      : isRefund
        ? "#8B5CF6"
        : "#6B7280";
  const borderColor = isDebit
    ? "#FCA5A5"
    : isCredit
      ? "#86EFAC"
      : isRefund
        ? "#C4B5FD"
        : "#E5E7EB";

  return (
    <View style={[styles.card, { borderLeftColor: borderColor }]}>
      {/* Header with Merchant and Category */}
      <View style={styles.header}>
        <Text style={styles.merchant}>{merchant}</Text>
        <View style={[styles.badge, { backgroundColor: categoryColor }]}>
          <Text style={styles.badgeText}>{category}</Text>
        </View>
      </View>

      {/* Amount and Transaction Type */}
      <View style={styles.amountSection}>
        <Text style={[styles.amount, { color: amountColor }]}>
          {isDebit ? "-" : "+"} EGP {amount}
        </Text>
        <Text style={styles.transactionType}>
          {transactionType === "debit" ? "CHARGE" : "CREDIT"}
        </Text>
      </View>

      {/* Payment Method and Card Info */}
      <View style={styles.paymentInfo}>
        <View style={styles.cardInfo}>
          <Text style={styles.cardText}>•••• {cardLast4}</Text>
          {usedApplePay && (
            <View style={styles.applePayBadge}>
              <Text style={styles.applePayText}> Pay</Text>
            </View>
          )}
        </View>
        <Text style={styles.dateTime}>
          {date} at {time}
        </Text>
      </View>

      {/* Available Limit */}
      {availableLimit && (
        <View style={styles.limitSection}>
          <Text style={styles.limitLabel}>Available Limit:</Text>
          <Text style={styles.limitAmount}>EGP {availableLimit}</Text>
        </View>
      )}

      {/* Action Buttons */}
      {(link || description) && (
        <View style={styles.actionSection}>
          {link && (
            <TouchableOpacity style={styles.linkBtn}>
              <Text style={styles.linkText}>View Details</Text>
            </TouchableOpacity>
          )}

          {description && (
            <TouchableOpacity
              style={styles.detailsBtn}
              onPress={() => setIsExpanded(!isExpanded)}
            >
              <Text style={styles.detailsText}>
                {isExpanded ? "Hide SMS" : "Show SMS"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Expanded SMS Content */}
      {isExpanded && description && (
        <View style={styles.smsSection}>
          <Text style={styles.smsLabel}>
            Original SMS Message (tap to copy):
          </Text>
          <TouchableOpacity style={styles.smsContent} onPress={handleCopySms}>
            <Text style={styles.smsText}>{description}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3, // shadow for Android
    shadowColor: "#000", // shadow for iOS
    shadowOpacity: 0.1,
    shadowRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: "#e5e5e5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  merchant: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    flex: 1,
    marginRight: 12,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  amountSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  amount: {
    fontSize: 20,
    fontWeight: "700",
  },
  transactionType: {
    fontSize: 11,
    fontWeight: "600",
    color: "#6b7280",
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    textTransform: "uppercase",
  },
  paymentInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#4b5563",
    fontFamily: "monospace",
  },
  applePayBadge: {
    backgroundColor: "#000",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  applePayText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
  dateTime: {
    fontSize: 12,
    color: "#6b7280",
  },
  limitSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    padding: 8,
    borderRadius: 6,
    marginBottom: 12,
  },
  limitLabel: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
  },
  limitAmount: {
    fontSize: 12,
    color: "#059669",
    fontWeight: "600",
  },
  actionSection: {
    flexDirection: "row",
    gap: 8,
  },
  linkBtn: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    flex: 1,
  },
  linkText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  detailsBtn: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    flex: 1,
  },
  detailsText: {
    color: "#4b5563",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  smsSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  smsLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: 8,
  },
  smsContent: {
    backgroundColor: "#f9fafb",
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#3b82f6",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  smsText: {
    fontSize: 13,
    lineHeight: 18,
    color: "#374151",
    fontFamily: "monospace",
  },
});

export default TransactionCard;
