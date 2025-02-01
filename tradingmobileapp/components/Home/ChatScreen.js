import React, { useState, useEffect } from "react";
import { View, TextInput, Button, FlatList, Text, StyleSheet } from "react-native";
import { getDatabase, ref, push, onValue } from "firebase/database";
import { initializeApp } from "firebase/app";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Cấu hình Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBl4QS8AzcoX...",
  authDomain: "chat-68081.firebaseapp.com",
  databaseURL: "https://chat-68081-default-rtdb.firebaseio.com",
  projectId: "chat-68081",
  storageBucket: "chat-68081.appspot.com",
  messagingSenderId: "1059521286986",
  appId: "1:1059521286986:web:8485c81db425451697e7b3",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [userId, setUserId] = useState("");

  // Lấy userId từ AsyncStorage
  useEffect(() => {
    const fetchUserId = async () => {
      const storedUserId = await AsyncStorage.getItem("user_id");
      setUserId(storedUserId || "guest");
    };
    fetchUserId();
  }, []);

  // Lấy tin nhắn theo thời gian thực
  useEffect(() => {
    const messagesRef = ref(db, "messages");
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messagesArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setMessages(messagesArray);
      }
    });
  }, []);

  // Gửi tin nhắn
  const sendMessage = () => {
    if (text.trim() === "") return;
    push(ref(db, "messages"), {
      userId,
      text,
      timestamp: new Date().toISOString(),
    });
    setText(""); // Reset ô nhập
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.messageContainer, item.userId === userId ? styles.myMessage : styles.otherMessage]}>
            <Text style={styles.userId}>{item.userId}</Text>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Nhập tin nhắn..."
        />
        <Button title="Gửi" onPress={sendMessage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#f5f5f5" },
  messageContainer: { padding: 10, marginVertical: 5, borderRadius: 8 },
  myMessage: { alignSelf: "flex-end", backgroundColor: "#007AFF", color: "#fff" },
  otherMessage: { alignSelf: "flex-start", backgroundColor: "#ddd" },
  userId: { fontSize: 12, fontWeight: "bold" },
  messageText: { fontSize: 16 },
  inputContainer: { flexDirection: "row", padding: 10, backgroundColor: "#fff" },
  input: { flex: 1, borderWidth: 1, borderColor: "#ccc", padding: 8, borderRadius: 5 },
});

export default ChatScreen;
