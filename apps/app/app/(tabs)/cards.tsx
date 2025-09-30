import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import CardInfo from "@/components/ui/CardInfo";

export default function CardsScreen() {
  const loading = false;
  const error = "";
  const cards = [];
  const messages = [];

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.loadingText}>Loading your cards...</Text>
        </View>
      </View>
    );
  }
 
  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>Error loading SMS messages</Text>
          <Text style={styles.errorDetail}>{error}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Cards</Text>
        <Text style={styles.subtitle}>
          {cards.length} card{cards.length !== 1 ? "s" : ""} found from{" "}
          {messages.length} SMS messages
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {cards.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No cards found</Text>
            <Text style={styles.emptySubtext}>
              Make sure you have bank SMS messages in your inbox
            </Text>
          </View>
        ) : (
          cards.map((card, index) => (
            <CardInfo key={`${card.cardLast4}-${index}`} card={card} />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    padding: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  loadingText: {
    fontSize: 16,
    color: "#6b7280",
  },
  errorText: {
    fontSize: 16,
    color: "#ef4444",
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
  },
  errorDetail: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4b5563",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },
});
