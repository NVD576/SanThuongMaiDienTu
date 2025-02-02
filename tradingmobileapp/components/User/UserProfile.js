import React, { useEffect, useState, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { View, Text, Image, FlatList } from "react-native";
import { Button, Card, Divider } from "react-native-paper";
import styles from "./UserProfileStyles";
import { BASE_URL } from "../../configs/APIs";
import { MyDispatchContext, MyUserContext } from "../../configs/UserContexts";
import db from "../../configs/firebase";
import { ref, get, child, onValue } from "firebase/database";

const UserProfile = () => {
  const { user } = useContext(MyUserContext);
  const dispatch = useContext(MyDispatchContext);
  const nav = useNavigation();

  const [pendingSellers, setPendingSellers] = useState([]);
  const [showPendingSellers, setShowPendingSellers] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [chatUsers, setChatUsers] = useState([]);
  const [showChatUsers, setShowChatUsers] = useState(false);

  const logout = async () => {
    await AsyncStorage.removeItem("user_id");
    await AsyncStorage.removeItem(`shoppingCart_${user.id}`);
    dispatch({ type: "logout" });
    nav.navigate("Home");
  };

  // Lấy danh sách seller có approval_status = "pending"
  const fetchPendingSellers = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.error("Không tìm thấy token, vui lòng đăng nhập lại.");
        return;
      }

      const response = await fetch(`${BASE_URL}/manage_sellers/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setPendingSellers(data);
      } else {
        console.log("Lỗi khi lấy danh sách seller:", data);
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
    }
  };

  const approveSeller = async (sellerId) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.error("Không tìm thấy token, vui lòng đăng nhập lại.");
        return;
      }

      const response = await fetch(`${BASE_URL}/manage_sellers/${sellerId}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "approved" }),
      });

      if (response.ok) {
        setPendingSellers((prevSellers) =>
          prevSellers.filter((seller) => seller.id !== sellerId)
        );
        console.log(`Seller ${sellerId} đã được duyệt.`);
      } else {
        const errorData = await response.json();
        console.error("Lỗi khi duyệt seller:", errorData);
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
    }
  };

  // Lấy danh sách người nhắn tin từ Firebase
  useEffect(() => {
    const fetchChatUsers = async () => {
      const userId = await AsyncStorage.getItem("user_id");
  
      if (!userId) return;
  
      const messagesRef = ref(db, `messages/${userId}`);
  
      onValue(messagesRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          console.log("Tin nhắn nhận được:", data);
  
          const users = new Set();
  
          // Duyệt qua các tin nhắn
          Object.keys(data).forEach((message) => {
            users.add(message);
          });
  
          console.log("Danh sách người nhắn tin:", Array.from(users));
          setChatUsers(Array.from(users));
        } else {
          console.log("Không có tin nhắn nào.");
          setChatUsers([]);
        }
      });
    };
  
    fetchChatUsers();
  }, []);



  useEffect(() => {
    console.log("Danh sách người nhắn tin:", chatUsers);
  }, [chatUsers]);
  // Fetch unread messages count
  useEffect(() => {
    const fetchUnreadMessages = async () => {
      const userId = await AsyncStorage.getItem("user_id");

      if (!userId) return;

      const messagesRef = ref(db, `messages/${userId}`);
      onValue(messagesRef, (snapshot) => {
        if (snapshot.exists()) {
          const messages = snapshot.val();
          const unreadCount = Object.values(messages).reduce((count, msg) => {
            if (msg.read === false) {
              count++;
            }
            return count;
          }, 0);
          setUnreadMessages(unreadCount);
        } else {
          setUnreadMessages(0);
        }
      });
    };

    fetchUnreadMessages();
  }, []);

  useEffect(() => {
    if (user?.role === "employee") {
      fetchPendingSellers();
    }
  }, [user]);

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content style={styles.header}>
          <Image
            source={{
              uri: user?.avatar
                ? `${BASE_URL}${user.avatar}`
                : "https://via.placeholder.com/150",
            }}
            style={styles.avatar}
          />
          <View style={styles.userInfo}>
            <Text style={styles.name}>
              {user?.first_name || "N/A"} {user?.last_name || ""}
            </Text>
            <Text style={styles.role}>{user?.role || "Guest"}</Text>
          </View>
        </Card.Content>
      </Card>

      {/* Info Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Thông tin cá nhân</Text>
          <Divider style={styles.divider} />
          <View style={styles.detailRow}>
            <Text style={styles.label}>Họ:</Text>
            <Text style={styles.value}>{user?.first_name || "N/A"}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Tên:</Text>
            <Text style={styles.value}>{user?.last_name || "N/A"}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{user?.email || "N/A"}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Vai trò:</Text>
            <Text style={styles.value}>{user?.role || "Guest"}</Text>
          </View>
        </Card.Content>
      </Card>

      {user?.role === "seller" && (
        <>
          <Button
            mode="contained"
            onPress={() => nav.navigate("CreateStore")}
            style={styles.createStoreButton}
          >
            Tạo cửa hàng
          </Button>
          <Button
            mode="contained"
            onPress={() => nav.navigate("AddProduct")}
            style={styles.addProductButton}
          >
            Thêm sản phẩm
          </Button>
          <Button
            mode="contained"
            onPress={() => nav.navigate("UserProducts")}
            style={styles.viewProductsButton}
          >
            Xem sản phẩm của tôi
          </Button>
          <Button
            mode="contained"
            onPress={() => nav.navigate("Statistics")}
            style={styles.pendingSellersButton}
          >
            Xem Thống Kê
          </Button>
        </>
      )}

      {/* Chat button */}
      {user?.role !== "admin" && (
        <Button
          mode="contained"
          onPress={() => {
            setShowChatUsers(!showChatUsers); // Lật trạng thái hiển thị danh sách người nhắn
          }}
          style={styles.receiveMessagesButton}
        >
          {unreadMessages > 0
            ? `Bạn có ${unreadMessages} tin nhắn chưa đọc`
            : chatUsers.length > 0
            ? `Có ${chatUsers.length} người đã nhắn tin`
            : "Nhận tin nhắn"}
        </Button>
      )}

      {/* Hiển thị danh sách người nhắn tin */}
      {showChatUsers && chatUsers.length > 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Danh sách người nhắn tin</Text>
            <Divider style={styles.divider} />
            <FlatList
              data={chatUsers}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <View style={styles.detailRow}>
                  <Text style={styles.label}>Người dùng: {item}</Text>
                  <Button
                    style={styles.value}
                    mode="contained"
                    onPress={() =>
                      nav.navigate("ChatScreen", { userId2: item })
                    }
                  >
                    Chat ngay
                  </Button>
                </View>
              )}
            />
          </Card.Content>
        </Card>
      )}

      {/* Pending Sellers for employee */}
      {user?.role === "employee" && (
        <Button
          mode="contained"
          onPress={() => setShowPendingSellers(!showPendingSellers)}
          style={styles.pendingSellersButton}
        >
          {showPendingSellers
            ? "Ẩn danh sách chờ duyệt"
            : "Xem seller chờ duyệt"}
        </Button>
      )}

      {showPendingSellers && (
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Danh sách seller chờ duyệt</Text>
            <Divider style={styles.divider} />
            <FlatList
              data={pendingSellers}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.detailRow}>
                  <Text style={styles.label}>
                    Seller: {item.first_name} {item.last_name}
                  </Text>
                  <Button
                    style={styles.value}
                    mode="contained"
                    onPress={() => approveSeller(item.id)}
                  >
                    Duyệt
                  </Button>
                </View>
              )}
            />
          </Card.Content>
        </Card>
      )}

      <Button mode="contained" onPress={logout}>
        Đăng xuất
      </Button>
    </View>
  );
};

export default UserProfile;
