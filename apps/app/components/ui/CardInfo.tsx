import { ICardInfo } from "@/utils";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface IProps {
  card: ICardInfo;
}

const CardInfo: React.FC<IProps> = ({ card }) => {
  const cardTypeColor =
    card.cardType === "credit"
      ? "#3B82F6"
      : card.cardType === "debit"
        ? "#10B981"
        : "#6B7280";
  const cardTypeBg =
    card.cardType === "credit"
      ? "#EFF6FF"
      : card.cardType === "debit"
        ? "#ECFDF5"
        : "#F3F4F6";

  return (
    <View style={[styles.card, { borderLeftColor: cardTypeColor }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.cardNumber}>
          <Text style={styles.cardText}>•••• {card.cardLast4}</Text>
          <View style={[styles.typeBadge, { backgroundColor: cardTypeBg }]}>
            <Text style={[styles.typeText, { color: cardTypeColor }]}>
              {card.cardType.toUpperCase()}
            </Text>
          </View>
        </View>
        <Text style={styles.bankName}>{card.bankName}</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{card.transactionCount}</Text>
          <Text style={styles.statLabel}>Transactions</Text>
        </View>

        {/* <View style={styles.stat}>
          <Text style={styles.statValue}>
            {card.currencies.size > 0
              ? Array.from(card.currencies).join(", ")
              : "EGP"}
          </Text>
          <Text style={styles.statLabel}>Currencies</Text>
        </View>

        <View style={styles.stat}>
          <Text style={styles.statValue}>
            {card.lastUsed.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
            })}
          </Text>
          <Text style={styles.statLabel}>Last Used</Text>
        </View> */}
      </View>

      {/* Features */}
      <View style={styles.features}>
        {card.usesApplePay && (
          <View style={styles.featureBadge}>
            <Text style={styles.featureText}> Pay</Text>
          </View>
        )}

        {/* {card.availableLimits.length > 0 && (
          <View style={styles.limitInfo}>
            <Text style={styles.limitLabel}>Limit:</Text>
            <Text style={styles.limitValue}>
              EGP{" "}
              {Math.max(
                ...card.availableLimits.map((l) =>
                  parseInt(l.replace(/,/g, ""))
                )
              )}
            </Text>
          </View>
        )} */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    borderLeftWidth: 4,
  },
  header: {
    marginBottom: 12,
  },
  cardNumber: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  cardText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
    fontFamily: "monospace",
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  typeText: {
    fontSize: 10,
    fontWeight: "700",
  },
  bankName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6b7280",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  stat: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
  statLabel: {
    fontSize: 11,
    color: "#6b7280",
    marginTop: 2,
  },
  features: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  featureBadge: {
    backgroundColor: "#000",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  featureText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
  limitInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f9ff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  limitLabel: {
    fontSize: 10,
    color: "#0369a1",
    marginRight: 4,
  },
  limitValue: {
    fontSize: 10,
    fontWeight: "600",
    color: "#0369a1",
  },
});

export default CardInfo;
