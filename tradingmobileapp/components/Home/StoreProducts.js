import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  Image,
  FlatList,
} from "react-native";
import Styles from "../../styles/Styles";
import APIs, { endpoints } from "../../configs/APIs";
import { useNavigation } from "@react-navigation/native";
import { Chip, Button } from "react-native-paper";

const StoreProducts = ({ route }) => {
  const { storeId } = route.params; // Lấy storeId từ tham số
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    try {
      const res = await APIs.get(endpoints["products"]); // Giả sử API này trả về sản phẩm của cửa hàng
      setProducts(res.data.results);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [storeId]); // Khi storeId thay đổi, gọi lại loadProducts

  return (
    <View style={Styles.container}>
      <Text style={Styles.title}>Sản phẩm của cửa hàng</Text>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#6200ee"
          style={{ marginTop: 20 }}
        />
      ) : (
        <ScrollView contentContainerStyle={Styles.scrollViewContainer}>
          <View style={Styles.productList}>
            {products.map((product) => (
              <View key={product.id} style={Styles.productContainer}>
                <Image
                  source={{ uri: product.image }} // Đảm bảo sản phẩm có trường `image` chứa URL hình ảnh
                  style={Styles.productImage}
                  resizeMode="contain"
                />
                <Text style={Styles.productName}>{product.name}</Text>
                <Text style={Styles.productName}>Price: {product.price}</Text>
                <Text style={Styles.productName}>Quantity: {product.stock_quantity}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
};
export default StoreProducts;
