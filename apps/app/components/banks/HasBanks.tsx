import React, { FC, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
} from "react-native";
import {
  IBank,
  useAppDispatch,
  useAppSelector,
  startPolling,
  stopPolling,
} from "@/store";
import MessageCard from "../messages/MessageCard";
import { checkSmsPermission, requestSmsPermission } from "@/utils/permissions";

interface IProps {
  selectedBanks: Array<IBank["id"]>;
}

const HasBanks: FC<IProps> = ({ selectedBanks }) => {
  const dispatch = useAppDispatch();
  const availableBanks = useAppSelector((state) => state.banks.availableBanks);
  const { messages, error, loading } = useAppSelector((state) => state.sms);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    // Check permissions first
    checkSmsPermission().then(setHasPermission);
  }, []);

  useEffect(() => {
    if (hasPermission === false) return; // Don't start polling without permission

    const bankAddresses = selectedBanks.flatMap((bankId) => {
      const bank = availableBanks.find((b) => b.id === bankId);
      return bank?.addresses || [];
    });

    if (bankAddresses.length > 0) {
      dispatch(
        startPolling({
          addresses: bankAddresses,
          maxCount: 100,
        })
      );
    }

    return () => {
      dispatch(stopPolling());
    };
  }, [selectedBanks, availableBanks, dispatch, hasPermission]);

  const handleRequestPermission = async () => {
    const granted = await requestSmsPermission();
    setHasPermission(granted);
  };

  const handleOpenSettings = () => {
    Linking.openSettings();
  };

  const renderMessages = () => {
    if (hasPermission === null) {
      return (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#0284c7" />
          <Text style={styles.loadingText}>Checking permissions...</Text>
        </View>
      );
    }

    if (hasPermission === false) {
      return (
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionIcon}>🔒</Text>
          <Text style={styles.permissionTitle}>SMS Permission Required</Text>
          <Text style={styles.permissionText}>
            This app needs permission to read SMS messages to track your
            transactions automatically.
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={handleRequestPermission}
          >
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={handleOpenSettings}
          >
            <Text style={styles.settingsButtonText}>Open Settings</Text>
          </TouchableOpacity>
        </View>
      );
    }

    switch (true) {
      case !!error:
        return (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Error: {error}</Text>
          </View>
        );

      case loading && messages.length === 0:
        return (
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" color="#0284c7" />
            <Text style={styles.loadingText}>Loading SMS messages...</Text>
          </View>
        );

      case messages.length === 0:
        return (
          <View style={styles.centerContent}>
            <Text style={styles.emptyText}>No transactions found</Text>
          </View>
        );

      default:
        return (
          <FlatList
            data={messages}
            renderItem={({ item }) => <MessageCard msg={item} />}
            keyExtractor={(item) => item._id.toString()}
            style={styles.messagesList}
          />
        );
    }
  };

  return (
    <View style={styles.container}>
      {/* Bank Status */}
      <View style={styles.bankStatus}>
        <Text style={styles.bankStatusText}>
          Tracking: {selectedBanks.join(", ")}
        </Text>
        <Text style={styles.bankStatusSubtext}>
          {messages.length} transactions found
        </Text>
      </View>
      {/* Search */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search transactions..."
      />

      {renderMessages()}
    </View>
  );
};

export default HasBanks;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    padding: 8,
  },
  bankStatus: {
    backgroundColor: "#e0f2fe",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#0284c7",
  },
  bankStatusText: {
    fontSize: 14,
    color: "#0c4a6e",
    fontWeight: "500",
  },
  bankStatusSubtext: {
    fontSize: 12,
    color: "#0369a1",
    marginTop: 4,
  },
  searchInput: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 16,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6b7280",
  },
  errorContainer: {
    backgroundColor: "#fef2f2",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#ef4444",
  },
  errorText: {
    fontSize: 14,
    color: "#991b1b",
  },
  emptyText: {
    fontSize: 16,
    color: "#9ca3af",
  },
  messagesList: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
    backgroundColor: "#fff",
    borderRadius: 12,
    margin: 16,
  },
  permissionIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 12,
    textAlign: "center",
  },
  permissionText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  permissionButton: {
    backgroundColor: "#0284c7",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
    width: "100%",
    alignItems: "center",
  },
  permissionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  settingsButton: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  settingsButtonText: {
    color: "#4b5563",
    fontSize: 14,
    fontWeight: "500",
  },
});
