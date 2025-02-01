import React, { useEffect, useState, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { View, Text, Image, FlatList } from "react-native";
import { Button, Card, Divider } from "react-native-paper";
import styles from "./UserProfileStyles";
import { BASE_URL } from "../../configs/APIs";
import { MyDispatchContext, MyUserContext } from "../../configs/UserContexts";

const UserProfile = () => {
  const { user } = useContext(MyUserContext);
  const dispatch = useContext(MyDispatchContext);
  const nav = useNavigation();

  const [pendingSellers, setPendingSellers] = useState([]);
  const [showPendingSellers, setShowPendingSellers] = useState(false);

  const logout = async () => {
    await AsyncStorage.removeItem("user_id");
    await AsyncStorage.removeItem(`shoppingCart_${user.id}`);
    dispatch({ type: "logout" });
    nav.navigate("Home");
  };

  // Lấy danh sách seller có approval_status = "pending"
  const fetchPendingSellers = async () => {
    try {
      const token = await AsyncStorage.getItem("token"); // Lấy token từ AsyncStorage
      if (!token) {
        console.error("Không tìm thấy token, vui lòng đăng nhập lại.");
        return;
      }

      const response = await fetch(`${BASE_URL}/manage_sellers/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Thêm token vào header
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
            onPress={() => nav.navigate("CreateStore")} // Chuyển đến màn hình tạo cửa hàng
            style={styles.createStoreButton}
          >
            Tạo cửa hàng
          </Button>
          <Button
            mode="contained"
            onPress={() => nav.navigate("AddProduct")} // Chuyển đến màn hình thêm sản phẩm
            style={styles.addProductButton}
          >
            Thêm sản phẩm
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
                    {item.username} ({item.approval_status})
                  </Text>
                  <Button
                    style={styles.value}
                    mode="contained"
                    onPress={() => approveSeller(item.id)}
                  >
                    Xác nhận
                  </Button>
                </View>
              )}
            />
          </Card.Content>
        </Card>
      )}

      {user?.role === "admin" && (
        <Button
          mode="contained"
          onPress={() => nav.navigate("SalesStatistics")}
          style={styles.pendingSellersButton}
        >
          Xem Thống Kê
        </Button>
      )}

      <Button mode="outlined" onPress={logout} style={styles.logoutButton}>
        Đăng xuất
      </Button>
    </View>
  );
};

export default UserProfile;
