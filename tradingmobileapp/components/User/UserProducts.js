import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, StyleSheet } from "react-native";
import { Button, Card, Divider } from "react-native-paper";
import APIs, { endpoints } from "../../configs/APIs";
import AsyncStorage from "@react-native-async-storage/async-storage"; 

const UserProducts = () => {
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);

  const fetchStores = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userId = await AsyncStorage.getItem("user_id");

      if (!token || !userId) {
        console.error("Không tìm thấy token hoặc user_id, vui lòng đăng nhập lại.");
        return;
      }

      const response = await APIs.get(endpoints.stores, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        params: { "seller": userId },
      });

      if (response.status === 200) {
        setStores(response.data.results);
      } else {
        console.log("Lỗi khi lấy danh sách cửa hàng:", response.data);
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
    }
  };

  const fetchUserProducts = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userId = await AsyncStorage.getItem("user_id");

      if (!token) {
        console.error("Không tìm thấy token, vui lòng đăng nhập lại.");
        return;
      }

      const response = await APIs.get(endpoints.products, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const filteredProducts = response.data.results.filter(product =>
          stores.some(store => store.id === product.store && store.seller === parseInt(userId))
        );
        setProducts(filteredProducts);
      } else {
        console.log("Lỗi khi lấy danh sách sản phẩm:", response.data);
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  useEffect(() => {
    if (stores.length > 0) {
      fetchUserProducts();
    }
  }, [stores]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sản phẩm của bạn</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Cover source={{ uri: item.image }} style={styles.image} />
            <Card.Content style={styles.cardContent}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>{item.price} VND</Text>
              <Divider style={styles.divider} />
              <View style={styles.buttonContainer}>
                <Button mode="contained" style={styles.editButton}>Chỉnh sửa</Button>
                <Button mode="outlined" style={styles.deleteButton}>Xóa</Button>
              </View>
            </Card.Content>
          </Card>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "gray"
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: "bold",
  },
  card: {
    marginBottom: 15,
    borderRadius: 10,
    elevation: 3,
  },
  image: {
    height: 150,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  cardContent: {
    padding: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 14,
    color: "#4CAF50",
    marginBottom: 10,
  },
  divider: {
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  editButton: {
    flex: 1,
    marginRight: 5,
  },
  deleteButton: {
    flex: 1,
    marginLeft: 5,
  },
});

export default UserProducts;
