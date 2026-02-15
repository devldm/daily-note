import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { useState } from "react";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { createEntry } from "@/db/db";
import { View, Text } from "@/components/Themed";

export default function Home() {
  const theme = useTheme();
  const colorScheme = useColorScheme();
  const [text, setText] = useState("");

  const handleSave = () => {
    const trimmedText = text.trim();
    if (trimmedText) {
      createEntry(trimmedText);
      Keyboard.dismiss();
      Alert.alert("Saved", "Your daily note has been saved!");
    } else {
      Alert.alert("Nothing to save", "Write something first!");
    }
    setText("");
  };

  const handleClear = () => {
    if (text.trim()) {
      Alert.alert(
        "Clear All",
        "Are you sure you want to clear all text? This cannot be undone.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Clear", style: "destructive", onPress: () => setText("") },
        ],
      );
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <KeyboardAvoidingView
        keyboardVerticalOffset={120}
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TextInput
          style={[
            styles.textArea,
            {
              color: Colors[colorScheme ?? "light"].text,
              backgroundColor: "transparent",
              fontFamily: "Serif",
            },
          ]}
          multiline
          placeholder="What's on your mind?"
          placeholderTextColor={Colors[colorScheme ?? "light"].placeholder}
          value={text}
          onChangeText={setText}
          textAlignVertical="top"
          autoFocus
          scrollEnabled
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              styles.clearButton,
              { borderColor: Colors[colorScheme ?? "light"].buttonBorder },
            ]}
            onPress={handleClear}
          >
            <Text
              style={[
                styles.buttonText,
                { color: Colors[colorScheme ?? "light"].text },
              ]}
            >
              Clear All
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              styles.saveButton,
              { backgroundColor: Colors[colorScheme ?? "light"].tint },
            ]}
            onPress={handleSave}
          >
            <Text
              style={[
                styles.buttonText,
                { color: Colors[colorScheme ?? "light"].background },
              ]}
            >
              Save
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  textArea: {
    flex: 1,
    fontSize: 32,
    lineHeight: 36,
    textAlign: "left",
    paddingTop: 0,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 0.45,
  },
  clearButton: {
    borderWidth: 2,
    backgroundColor: "transparent",
  },
  saveButton: {},
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
});
