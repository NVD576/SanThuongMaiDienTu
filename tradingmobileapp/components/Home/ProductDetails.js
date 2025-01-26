import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  ActivityIndicator,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import ProductDetailStyles from "./ProductDetailStyles";
import APIs, { endpoints } from "../../configs/APIs";

const ProductDetails = ({ route }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { productId } = route.params;

  const loadProductDetails = async () => {
    try {
      const res = await APIs.get(endpoints["product-details"](productId));
      setProduct(res.data);
    } catch (error) {
      console.error("Error loading product details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProductDetails();
  }, [productId]);

  const handleBuyNow = () => {
    Alert.alert("Mua hàng", `Bạn đã chọn mua ${product?.name}!`);
  };

  if (loading) {
    return (
      <View style={ProductDetailStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={ProductDetailStyles.loadingText}>Đang tải...</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={ProductDetailStyles.errorContainer}>
        <Text style={ProductDetailStyles.errorText}>
          Không tìm thấy sản phẩm. Vui lòng thử lại sau.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={ProductDetailStyles.container}>
      <Image
        source={{ uri: product.image }}
        style={ProductDetailStyles.productImage}
        resizeMode="cover"
      />
      <View style={ProductDetailStyles.infoContainer}>
        <Text style={ProductDetailStyles.productName}>{product.name}</Text>
        <Text style={ProductDetailStyles.productPrice}>${product.price}</Text>
        <Text style={ProductDetailStyles.productStock}>
          Số lượng còn: {product.stock_quantity}
        </Text>
        <Text style={ProductDetailStyles.productDescription}>
          {product.description || "Mô tả sản phẩm chưa được cập nhật."}
        </Text>
      </View>
      <TouchableOpacity
        style={ProductDetailStyles.buyButton}
        onPress={handleBuyNow}
      >
        <Text style={ProductDetailStyles.buyButtonText}>Mua ngay</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ProductDetails;
