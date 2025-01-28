import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import React, { useState } from "react";
import { Button, FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import styles from "../Home/ShoppingCartStyles";

const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState([]);

  const loadCartItems = async () => {
    try {
      const storedCart = await AsyncStorage.getItem("shoppingCart");
      setCartItems(storedCart ? JSON.parse(storedCart) : []);
    } catch (error) {
      console.error("Error loading cart items:", error);
      Alert.alert("Lỗi", "Không thể tải giỏ hàng. Vui lòng thử lại!");
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      const updatedCart = cartItems.filter((item) => item.id !== itemId);
      setCartItems(updatedCart);
      await AsyncStorage.setItem("shoppingCart", JSON.stringify(updatedCart));
    } catch (error) {
      console.error("Error removing item:", error);
      Alert.alert("Lỗi", "Không thể xóa sản phẩm. Vui lòng thử lại!");
    }
  };

  // Tự động tải giỏ hàng khi màn hình được focus
  useFocusEffect(
    React.useCallback(() => {
      loadCartItems();
    }, [])
  );

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛒 Giỏ Hàng</Text>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text>Số lượng: {item.quantity}</Text>
              <Text>Giá: {item.price} VND</Text>
              <Text>Tổng: {item.price * item.quantity} VND</Text>
            </View>
            <TouchableOpacity
              onPress={() => handleRemoveItem(item.id)}
              style={styles.removeButton}
            >
              <Text style={styles.removeButtonText}>Xóa</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <View style={styles.footer}>
        <Text style={styles.totalPrice}>Tổng cộng: {getTotalPrice()} VND</Text>
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={() => console.log("Proceeding to Checkout")}
        >
          <Text style={styles.checkoutButtonText}>Thanh Toán</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ShoppingCart;