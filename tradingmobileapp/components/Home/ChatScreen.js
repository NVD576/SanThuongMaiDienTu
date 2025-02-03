import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  FlatList,
  Text,
  StyleSheet,
  Alert,
} from "react-native";
import { ref, push, onValue, off, set } from "firebase/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import db from "../../configs/firebase";

import { useNavigation } from "@react-navigation/native"; // Để điều hướng\

const ChatScreen = ({ route, navigation }) => {
  const { userId2 } = route.params; // Nhận userId2 từ params
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [userId, setUserId] = useState("");

  // Lấy userId từ AsyncStorage
  useEffect(() => {
    const fetchUserId = async () => {
      const storedUserId = await AsyncStorage.getItem("user_id");
      setUserId(storedUserId);
    };

    fetchUserId();
  }, []); // Chạy một lần khi component được mount

  // Lấy tin nhắn theo thời gian thực
  useEffect(() => {
    if (userId && userId2) {
      const messagesRef = ref(db, `messages/${userId}/${userId2}`);
      const unsubscribe = onValue(messagesRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const messagesArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setMessages(messagesArray);

          // Cập nhật trạng thái "read" của tin nhắn chưa đọc
          messagesArray.forEach((message) => {
            if (!message.read ) {
              const messageRef = ref(
                db,
                `messages/${userId}/${userId2}/${message.id}`
              );
              set(messageRef, {
                ...message,
                read: true, // Đánh dấu là đã đọc
              });
            }
          });
        } else {
          console.log("No data found");
          setMessages([]);
        }
      });

      // Dọn dẹp listener khi component unmount hoặc userId, userId2 thay đổi
      return () => {
        off(messagesRef); // Hủy bỏ listener
      };
    }
  }, [userId, userId2]); // Re-run effect khi userId, userId2 thay đổi

  // Gửi tin nhắn
  const sendMessage = () => {
    if (text.trim() === "") return;

    const timestamp = new Date().toISOString();

    const messagesRef1 = ref(db, `messages/${userId}/${userId2}`);
    const messagesRef2 = ref(db, `messages/${userId2}/${userId}`);

    const newMessage = {
      senderId: (userId),
      receiverId: userId2,
      text: text,
      timestamp: timestamp,
      status: "sent", // Trạng thái ban đầu là "sent"
      read: false,
    };

    push(messagesRef1, newMessage);
    push(messagesRef2, newMessage);

    setText(""); // Reset ô nhập
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageContainer,
              item.senderId === userId ? styles.myMessage : styles.otherMessage,
              item.read && item.receiverId === userId && styles.readMessage, // Thêm style cho tin nhắn đã đọc
            ]}
          >
            <Text style={styles.userId}>
              {item.senderId === userId ? "You" : "Customer"}
            </Text>
            <Text style={styles.messageText}>{item.text}</Text>
            <Text style={styles.timestamp}>
              {new Date(item.timestamp).toLocaleTimeString()}
            </Text>
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
  messageContainer: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
    maxWidth: "80%",
  },
  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#007AFF",
    color: "#fff",
  },
  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#ddd",
  },
  userId: { fontSize: 12, fontWeight: "bold", color: "#333" },
  messageText: { fontSize: 16, color: "#333" },
  timestamp: { fontSize: 10, color: "#999", marginTop: 5 },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 5,
  },
  readMessage: {
    backgroundColor: "#e6e6e6", // Màu nền của tin nhắn đã đọc
  },
});

export default ChatScreen;
