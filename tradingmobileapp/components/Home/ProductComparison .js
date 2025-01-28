import React, { useEffect, useState } from "react";
import { FlatList, Text, View, Image, ActivityIndicator } from "react-native";
import APIs, { endpoints } from "../../configs/APIs"; // Thêm APIs để gọi thông tin cửa hàng
import styles from "../Home/ProductComparisonStyles";

const ProductComparison = ({ route }) => {
  const { products } = route.params;
  const [stores, setStores] = useState({});
  const [loading, setLoading] = useState(true);

  // Hàm tải thông tin cửa hàng
  const loadStoreDetails = async () => {
    try {
      const storePromises = products.map((product) =>
        APIs.get(endpoints["stores"] + product.store) // Gọi API lấy thông tin cửa hàng
      );

      const storeResponses = await Promise.all(storePromises);
      const storeData = {};
      storeResponses.forEach((res, index) => {
        storeData[products[index].store] = res.data;
      });

      setStores(storeData);
    } catch (error) {
      console.error("Error loading store details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStoreDetails();
  }, [products]);

  // Hàm định dạng giá tiền
  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
  };

  const renderProductItem = ({ item }) => (
    <View style={styles.productItem}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>Giá: {formatPrice(item.price)}</Text>
      <Text style={styles.productRating}>
        Đánh giá: {item.rating || "Chưa có"}★
      </Text>
      <Text style={styles.storeName}>
        Cửa hàng: {stores[item.store]?.name || "Đang tải..."}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Đang tải thông tin...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>So sánh sản phẩm</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderProductItem}
      />
    </View>
  );
};

export default ProductComparison;
