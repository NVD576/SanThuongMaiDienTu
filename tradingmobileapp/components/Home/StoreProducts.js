import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  ActivityIndicator,
  Image,
  FlatList,
} from "react-native";
import StoreProductStyles from "../Home/StoreProductStyles";
import APIs, { endpoints } from "../../configs/APIs";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";

// Component cho từng sản phẩm
const ProductCard = ({ product }) => {
  return (
    <TouchableOpacity style={StoreProductStyles.productCard}>
      <Image
        source={{ uri: product.image }}
        style={StoreProductStyles.productImage}
        resizeMode="cover"
      />
      <View style={StoreProductStyles.productInfo}>
        <Text style={StoreProductStyles.productName}>{product.name}</Text>
        <Text style={StoreProductStyles.productPrice}>Price: ${product.price}</Text>
        <Text style={StoreProductStyles.productStock}>
          In Stock: {product.stock_quantity}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const StoreProducts = ({ route }) => {
  const { storeId } = route.params; // Lấy storeId từ tham số
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    try {
      const res = await APIs.get(endpoints["products"]);
      const filteredProducts = res.data.results.filter(
        (product) => product.store === storeId // Lọc sản phẩm theo storeId
      );
      setProducts(filteredProducts);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [storeId]);

  return (
    <View style={StoreProductStyles.container}>
      <Text style={StoreProductStyles.title}>Sản phẩm của cửa hàng</Text>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#6200ee"
          style={{ marginTop: 20 }}
        />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <ProductCard product={item} />}
          numColumns={2} // Hiển thị sản phẩm theo dạng lưới
          contentContainerStyle={StoreProductStyles.productList}
        />
      )}
    </View>
  );
};

export default StoreProducts;
