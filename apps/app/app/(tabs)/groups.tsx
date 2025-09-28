import React, { useState, useMemo } from "react";
import GroupCard from "@/components/ui/GroupCard";
import {
  CreateGroupModal,
  EditGroupModal,
  EmptyGroups,
} from "@/components/groups";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
  StatusBar,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import {
  useAppDispatch,
  useAppSelector,
  deleteGroupWithCleanup,
  IGroup,
} from "@/store";

const GroupsScreen = () => {
  const dispatch = useAppDispatch();
  const groups = useAppSelector((state) => state.groups.groups);

  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingGroup, setEditingGroup] = useState<IGroup | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredGroups = useMemo(() => {
    let filtered = groups;

    if (searchQuery.trim()) {
      filtered = filtered.filter((group) =>
        group.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [groups, searchQuery]);

  const handleDeleteGroup = (id: string) => {
    dispatch(deleteGroupWithCleanup(id));
  };

  const handleCloseEditModal = () => {
    setEditModalVisible(false);
    setEditingGroup(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />

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
              placeholder="Search groups..."
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
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {filteredGroups.length === 0 ? (
          <EmptyGroups
            groups={groups}
            onCreateGroup={() => setCreateModalVisible(true)}
          />
        ) : (
          <FlatList
            style={styles.flatListContainer}
            data={filteredGroups}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <GroupCard
                name={item.name}
                color={item.color}
                count={1}
                onDelete={() => handleDeleteGroup(item.id)}
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setCreateModalVisible(true)}
        activeOpacity={0.8}
      >
        <Feather name="plus" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Modals */}
      <CreateGroupModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
      />

      <EditGroupModal
        visible={editModalVisible}
        group={editingGroup}
        onClose={handleCloseEditModal}
      />
    </SafeAreaView>
  );
};

export default GroupsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  content: {
    flex: 1,
    paddingHorizontal: 0,
  },
  flatListContainer: {
    paddingTop: 18,
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
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#000",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#666",
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
  clearButton: {
    padding: 4,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
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
