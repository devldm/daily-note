import { useState, useCallback, useRef, useMemo } from "react";
import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  useColorScheme,
  Pressable,
} from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { db, fetchAll, toggleStarred } from "../../db/db";
import { entriesTable } from "../../db/schema";
import { eq } from "drizzle-orm";
import { View, Text } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { Link } from "expo-router";
import { Note } from "@/types/Note";
import { useFocusEffect } from "@react-navigation/native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function EntriesScreen() {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [entries, setEntries] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<Note | null>(null);

  const snapPoints = useMemo(() => ["25%"], []);

  const openBottomSheet = (entry: Note) => {
    setSelectedEntry(entry);
    bottomSheetRef.current?.expand();
  };

  const closeBottomSheet = () => {
    bottomSheetRef.current?.close();
  };

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      setSelectedEntry(null);
    }
  }, []);

  const toggleSheet = (item: Note) => {
    if (selectedEntry?.id === item.id) {
      closeBottomSheet();
    } else {
      openBottomSheet(item);
    }
  };

  const fetchEntries = async () => {
    try {
      const result = await fetchAll();
      setEntries(result);
    } catch (error) {
      console.error("Error fetching entries:", error);
      Alert.alert("Error", "Failed to load diary entries");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const toggleStar = async (id: number, currentStarred: boolean) => {
    try {
      await toggleStarred(id);

      setEntries((prev) =>
        prev.map((entry) =>
          entry.id === id
            ? { ...entry, starred: !currentStarred, updatedAt: new Date() }
            : entry,
        ),
      );

      setSelectedEntry((prev) =>
        prev && prev.id === id
          ? { ...prev, starred: !currentStarred, updatedAt: new Date() }
          : prev,
      );
    } catch (error) {
      console.error("Error toggling star:", error);
      Alert.alert("Error", "Failed to update entry");
    }
  };

  const deleteEntry = async (id: number) => {
    Alert.alert("Delete Entry", "Are you sure you want to delete this note?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await db.delete(entriesTable).where(eq(entriesTable.id, id));
            setEntries((prev) => prev.filter((entry) => entry.id !== id));
            setSelectedEntry(null);
          } catch (error) {
            console.error("Error deleting note:", error);
            Alert.alert("Error", "Failed to delete note");
          }
        },
      },
    ]);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date));
  };

  const getPreview = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  useFocusEffect(
    useCallback(() => {
      fetchEntries();
    }, []),
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchEntries();
  };

  const colorScheme = useColorScheme();
  const renderEntry = ({ item }: { item: Note }) => {
    const isSelected = selectedEntry?.id === item.id;
    return (
      <TouchableOpacity
        onPress={() => {
          console.log("Tapping entry:", item.id);
          toggleSheet(item);
        }}
        style={[
          styles.card,
          { backgroundColor: Colors[colorScheme ?? "light"].card },
          isSelected && styles.selectedCard,
        ]}
      >
        <View style={[styles.cardHeader]} colorName="card">
          <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>
        </View>

        <View style={styles.cardContent} colorName={"card"}>
          <Text style={styles.contentText}>{getPreview(item.content)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.loadingText}>Loading your entries...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ display: "flex", flexDirection: "column" }}>
          <Text style={styles.title}>Diary</Text>
          <Text style={styles.subtitle}>
            {entries.length} {entries.length === 1 ? "entry" : "entries"}
          </Text>
        </View>
        <>
          <Link href="/settings" asChild>
            <Pressable>
              {({ pressed }) => (
                <FontAwesome
                  name="cog"
                  size={25}
                  color={Colors[colorScheme ?? "light"].text}
                  style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                />
              )}
            </Pressable>
          </Link>
        </>
      </View>

      {entries.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons
            name="book-outline"
            size={64}
            style={{ color: Colors[colorScheme ?? "light"].text }}
          />
          <Text style={styles.emptyTitle}>No entries yet</Text>
          <Text style={styles.emptySubtitle}>
            Start writing your first daily note!
          </Text>
        </View>
      ) : (
        <GestureHandlerRootView style={{ flex: 1 }}>
          <FlatList
            data={entries}
            renderItem={renderEntry}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
          {selectedEntry && (
            <BottomSheet
              ref={bottomSheetRef}
              snapPoints={snapPoints}
              onChange={handleSheetChanges}
              enablePanDownToClose={true}
              backgroundStyle={{
                backgroundColor: Colors[colorScheme ?? "light"].bottomSheet,
              }}
            >
              <BottomSheetView style={[styles.bottomSheetContent]}>
                <View
                  style={[
                    styles.bottomSheetActions,
                    {
                      borderTopColor:
                        Colors[colorScheme ?? "light"].text + "10",
                      backgroundColor:
                        Colors[colorScheme ?? "light"].bottomSheet,
                    },
                  ]}
                >
                  <TouchableOpacity
                    onPress={() => {
                      console.log("edit");
                    }}
                    style={[styles.sheetActionButton]}
                  >
                    <Ionicons
                      name="create"
                      size={24}
                      color={Colors[colorScheme ?? "light"].tint}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() =>
                      toggleStar(selectedEntry.id, selectedEntry.starred)
                    }
                    style={styles.sheetActionButton}
                  >
                    <Ionicons
                      name={selectedEntry.starred ? "star" : "star-outline"}
                      size={24}
                      color={
                        selectedEntry.starred
                          ? "#FFD700"
                          : Colors[colorScheme ?? "light"].tint + "80"
                      }
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      deleteEntry(selectedEntry.id);
                    }}
                    style={styles.sheetActionButton}
                  >
                    <Ionicons name="trash" size={24} color="#FF6B6B" />
                  </TouchableOpacity>
                </View>
                {/* Metadata Section */}
                <View
                  style={[
                    styles.metaSection,
                    {
                      backgroundColor:
                        Colors[colorScheme ?? "light"].bottomSheet,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.metaRow,
                      {
                        backgroundColor:
                          Colors[colorScheme ?? "light"].bottomSheet,
                      },
                    ]}
                    colorName="bottomSheet"
                  >
                    <Text
                      style={[
                        styles.metaLabel,
                        { color: Colors[colorScheme ?? "light"].text },
                      ]}
                    >
                      Word count
                    </Text>
                    <View
                      style={styles.metaValueContainer}
                      colorName="bottomSheet"
                    >
                      <Ionicons
                        name="document-text-outline"
                        size={20}
                        color={Colors[colorScheme ?? "light"].text}
                      />
                      <Text
                        style={[
                          styles.metaText,
                          { color: Colors[colorScheme ?? "light"].text },
                        ]}
                      >
                        {selectedEntry.content
                          ? selectedEntry.content.trim().split(/\s+/).length
                          : 0}{" "}
                        words
                      </Text>
                    </View>
                  </View>

                  <View style={styles.metaRow} colorName="bottomSheet">
                    <Text
                      style={[
                        styles.metaLabel,
                        { color: Colors[colorScheme ?? "light"].text },
                      ]}
                    >
                      Updated at
                    </Text>
                    <View
                      style={styles.metaValueContainer}
                      colorName="bottomSheet"
                    >
                      <Ionicons
                        name="time-outline"
                        size={20}
                        color={Colors[colorScheme ?? "light"].text}
                      />
                      <Text
                        style={[
                          styles.metaText,
                          { color: Colors[colorScheme ?? "light"].text },
                        ]}
                      >
                        {new Date(
                          selectedEntry.updatedAt || selectedEntry.createdAt,
                        ).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year:
                            new Date(
                              selectedEntry.updatedAt ||
                                selectedEntry.createdAt,
                            ).getFullYear() !== new Date().getFullYear()
                              ? "numeric"
                              : undefined,
                        })}
                      </Text>
                    </View>
                  </View>
                </View>
              </BottomSheetView>
            </BottomSheet>
          )}
        </GestureHandlerRootView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "inherit",
  },
  dateText: {
    fontSize: 14,
    color: "#888",
    fontWeight: "500",
  },
  cardActions: {
    flexDirection: "row",
    gap: 8,
    backgroundColor: "inherit",
  },
  actionButton: {
    padding: 4,
  },
  cardContent: {
    marginBottom: 8,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
  },
  updatedText: {
    fontSize: 12,
    fontStyle: "italic",
    marginTop: 8,
  },
  loadingText: {
    fontSize: 18,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  entryTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
    lineHeight: 26,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: "center",
  },

  bottomSheetContent: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 28,
    gap: 20, // consistent spacing between sections
  },

  bottomSheetActions: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.08)", // light divider
  },

  sheetActionButton: {
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 12,
  },

  metaSection: {
    gap: 18,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.08)",
  },

  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  metaLabel: {
    fontSize: 15,
    flex: 1,
  },
  metaValueContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
    justifyContent: "flex-end",
  },

  metaText: {
    fontSize: 14,
    fontWeight: "500",
    opacity: 0.85,
  },

  selectedCard: {
    borderWidth: 2,
    borderColor: "#b8860b",
    shadowColor: "#b8860b",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
