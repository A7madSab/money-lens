import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface IProps {
  title: string;
  category: string;
  categoryColor: string;
  date: string;
  amount: string;
  description: string;
}

const TransactionCard: React.FC<IProps> = ({
  title,
  category,
  categoryColor,
  date,
  amount,
  description,
}) => {
  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <View style={[styles.badge, { backgroundColor: categoryColor }]}>
          <Text style={styles.badgeText}>{category}</Text>
        </View>
      </View>

      {/* Date + Amount */}
      <Text style={styles.date}>
        {date} • {amount}
      </Text>

      {/* Description */}
      <Text style={styles.description}>{description}</Text>

      {/* Add More Button */}
      <TouchableOpacity style={styles.addMoreBtn}>
        <Text style={styles.addMoreText}>+ Add More</Text>
      </TouchableOpacity>
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
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  date: {
    marginTop: 4,
    fontSize: 14,
    color: "#666",
  },
  description: {
    marginTop: 8,
    fontSize: 13,
    color: "#444",
  },
  addMoreBtn: {
    marginTop: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    alignItems: "center",
  },
  addMoreText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#333",
  },
});

export default TransactionCard;
