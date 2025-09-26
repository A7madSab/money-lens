import TransactionCard from "@/components/ui/TransactionCard";
import { useSms } from "@/hooks/useSms";
import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function ExpenseTrackerScreen() {
  const [messages, latest, loading, error] = useSms({ delay: 5000 });

  console.log({ latest, loading, error });

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Expense Trackerrr</Text>

      {/* Search */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search transactions..."
      />

      {/* Loader / Error handling */}
      {loading && <ActivityIndicator size="large" color="#007AFF" />}
      {error && <Text style={styles.errorText}>⚠️ {error.message}</Text>}

      {/* Messages */}
      <ScrollView>
        {messages.map((msg) => (
          <TransactionCard
            key={msg._id}
            title={parseTitle(msg)} // <- parser function
            category={parseCategory(msg)} // <- parser function
            categoryColor={parseCategoryColor(msg)} // <- parser function
            date={new Date(msg.date).toLocaleDateString()}
            amount={parseAmount(msg)}
            description={msg.body}
          />
        ))}
      </ScrollView>
    </View>
  );
}

// --- Helpers: parse SMS into structured fields ---
function parseTitle(msg: any) {
  if (msg.body.includes("AMAZON")) return "Amazon";
  if (msg.body.includes("SWIGGY")) return "Swiggy";
  if (msg.body.includes("PETROL")) return "Indian Oil Petrol Pump";
  return "Transaction";
}

function parseCategory(msg: any) {
  if (msg.body.includes("SWIGGY")) return "Food & Dining";
  if (msg.body.includes("PETROL")) return "Fuel";
  if (msg.body.includes("AMAZON")) return "Shopping";
  return "Other";
}

function parseCategoryColor(msg: any) {
  if (msg.body.includes("SWIGGY")) return "#FF6B6B";
  if (msg.body.includes("PETROL")) return "#4dabf7";
  if (msg.body.includes("AMAZON")) return "#51cf66";
  return "#888";
}

function parseAmount(msg: any) {
  const match = msg.body.match(/Rs\s?([\d,]+\.\d{2}|\d+)/i);
  return match ? `₹${match[1]}` : "₹0.00";
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    padding: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
  },
  searchInput: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 16,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 8,
  },
});
