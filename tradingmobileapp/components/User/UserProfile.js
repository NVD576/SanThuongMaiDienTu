import React, { useEffect, useState, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { View, Text, Image,  ScrollView } from "react-native";
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
        console.log(`Seller ${sellerId} đã được duyệt.`);
        setPendingSellers((prevSellers) =>
          prevSellers.filter((seller) => seller.id !== sellerId)
        );
      } else {
        const errorData = await response.json();
        console.error("Lỗi khi duyệt seller:", errorData);
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
    }
  };
  

  const rejectSeller = async (sellerId) => {
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
        body: JSON.stringify({ status: "rejected" }),
      });
  
      if (response.ok) {
        console.log(`Seller ${sellerId} đã bị từ chối.`);
        setPendingSellers((prevSellers) =>
          prevSellers.filter((seller) => seller.id !== sellerId)
        );
      } else {
        const errorData = await response.json();
        console.error("Lỗi khi từ chối seller:", errorData);
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
    if (user?.role === "employee" && showPendingSellers) {
      fetchPendingSellers();
    }
  }, [user, showPendingSellers]);

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      nestedScrollEnabled={true}
    >
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
              : "Không có tin nhắn"}
          </Button>
        )}

        {/* Hiển thị danh sách người nhắn tin */}
        {showChatUsers && chatUsers.length > 0 && (
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Danh sách người nhắn tin</Text>
              <Divider style={styles.divider} />
              {chatUsers.map((item, index) => (
                <View key={index} style={styles.detailRow}>
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
              ))}
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
              : `Xem seller chờ duyệt  (${pendingSellers.length})`}
          </Button>
        )}

{showPendingSellers && (
  <Card style={styles.card}>
    <Card.Content>
      <Text style={styles.sectionTitle}>
        Danh sách seller chờ duyệt
      </Text>
      <Divider style={styles.divider} />
      {pendingSellers.map((item, index) => (
        <View key={index} style={styles.detailRow}>
          <Text style={styles.label}>
            UserName: {item.username} {'\n'}
            email: {item.email}
          </Text>

          <View style={styles.buttonRow}>
            <Button
              style={styles.approveButton}
              mode="contained"
              onPress={() => approveSeller(item.id)}
            >
              Duyệt
            </Button>
            <Button
              style={styles.rejectButton}
              mode="outlined"
              onPress={() => rejectSeller(item.id)}
            >
              Từ chối
            </Button>
          </View>
        </View>
      ))}
    </Card.Content>
  </Card>
)}


        <Button mode="contained" onPress={logout} style={styles.logoutButton}>
          Đăng xuất
        </Button>
      </View>
    </ScrollView>
  );
};

export default UserProfile;
