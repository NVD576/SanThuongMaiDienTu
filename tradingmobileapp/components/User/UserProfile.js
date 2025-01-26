import React, { useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { View, Text, Image } from "react-native";
import { Button, Card, Divider } from "react-native-paper";
import styles from "./UserProfileStyles";
import { BASE_URL } from "../../configs/APIs"
import { MyDispatchContext, MyUserContext } from "../../configs/UserContexts";


const UserProfile = () => {
  const { user } = useContext(MyUserContext);
  const dispatch = useContext(MyDispatchContext);
  const nav = useNavigation();

  console.log(BASE_URL)

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    dispatch({ type: "logout" });
    nav.navigate("Home");
  };

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

      <Button mode="outlined" onPress={logout} style={styles.logoutButton}>
        Đăng xuất
      </Button>
    </View>
  );
};

export default UserProfile;
