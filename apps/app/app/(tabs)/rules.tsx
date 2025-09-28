import React, { useState, useMemo } from "react";
import RuleCard from "@/components/ui/RuleCard";
import { CreateRuleModal, EditRuleModal } from "@/components/rules";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
  StatusBar,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  useAppDispatch,
  useAppSelector,
  deleteRule,
  toggleRuleActiveWithReapply,
  IRule,
} from "@/store";
import EmptyRules from "@/components/rules/EmptyRules";

const AutomationRulesScreen = () => {
  const dispatch = useAppDispatch();
  const rules = useAppSelector((state) => state.rules.rules);
  const groups = useAppSelector((state) => state.groups.groups);
  const activeRules = useMemo(
    () => rules.filter((rule) => rule.isActive),
    [rules]
  );
  const inactiveRules = useMemo(
    () => rules.filter((rule) => !rule.isActive),
    [rules]
  );

  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingRule, setEditingRule] = useState<IRule | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterActive, setFilterActive] = useState<boolean | null>(null);

  // Filtered and searched rules
  const filteredRules = useMemo(() => {
    return rules.filter((rule) => {
      const matchesSearch =
        rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rule.contains.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter =
        filterActive === null || rule.isActive === filterActive;

      return matchesSearch && matchesFilter;
    });
  }, [rules, searchQuery, filterActive]);

  const handleEditRule = (rule: IRule) => {
    setEditingRule(rule);
    setEditModalVisible(true);
  };

  const handleCloseCreateModal = () => {
    setCreateModalVisible(false);
  };

  const handleCloseEditModal = () => {
    setEditModalVisible(false);
    setEditingRule(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* App Bar */}
      <View style={styles.appBar}>
        {/* Search and Filter Bar */}
        <View style={styles.searchBar}>
          <View style={styles.searchContainer}>
            <Feather
              name="search"
              size={20}
              color="#666"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search rules..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#999"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={20} color="#999" />
              </TouchableOpacity>
            )}
          </View>

          {/* Filter Buttons */}
          <View style={styles.filterContainer}>
            <TouchableOpacity
              style={[
                styles.filterChip,
                filterActive === null && styles.filterChipActive,
              ]}
              onPress={() => setFilterActive(null)}
            >
              <Text
                style={[
                  styles.filterText,
                  filterActive === null && styles.filterTextActive,
                ]}
              >
                All ({rules.length})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterChip,
                filterActive === true && styles.filterChipActive,
              ]}
              onPress={() => setFilterActive(true)}
            >
              <Text
                style={[
                  styles.filterText,
                  filterActive === true && styles.filterTextActive,
                ]}
              >
                Active ({activeRules.length})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterChip,
                filterActive === false && styles.filterChipActive,
              ]}
              onPress={() => setFilterActive(false)}
            >
              <Text
                style={[
                  styles.filterText,
                  filterActive === false && styles.filterTextActive,
                ]}
              >
                Inactive ({inactiveRules.length})
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Rules List */}
      <View style={styles.content}>
        {filteredRules.length === 0 ? (
          <EmptyRules rules={rules} />
        ) : (
          <FlatList
            data={filteredRules}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const group = groups.find((g) => g.id === item.groupId) || {
                color: "grey",
                id: "ungrouped",
                name: "ungrouped",
              };

              return (
                <RuleCard
                  rule={item}
                  group={group}
                  onToggle={() =>
                    dispatch(toggleRuleActiveWithReapply(item.id))
                  }
                  onDelete={() => dispatch(deleteRule(item.id))}
                  onEdit={() => handleEditRule(item)}
                />
              );
            }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>

      {/* floating action buttons */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setCreateModalVisible(true)}
      >
        <Feather name="plus" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Modals */}
      <CreateRuleModal
        visible={createModalVisible}
        onClose={handleCloseCreateModal}
      />

      <EditRuleModal
        visible={editModalVisible}
        rule={editingRule}
        onClose={handleCloseEditModal}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  appBar: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 28,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  searchBar: {
    gap: 12,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    paddingVertical: 4,
  },
  filterContainer: {
    flexDirection: "row",
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
  },
  filterChipActive: {
    backgroundColor: "#007AFF",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  filterTextActive: {
    color: "#fff",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  listContent: {
    paddingVertical: 16,
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});

export default AutomationRulesScreen;
