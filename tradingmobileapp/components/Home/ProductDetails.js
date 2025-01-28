import React, { use, useEffect, useState } from "react";
import { LogBox, Text, View, ActivityIndicator, Image, TouchableOpacity, Alert, TextInput, FlatList } from "react-native";
import ProductDetailStyles from "./ProductDetailStyles";
import APIs, { endpoints } from "../../configs/APIs";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AirbnbRating } from "react-native-ratings";

// Ignore specific log warnings
LogBox.ignoreLogs([
  "Warning: Star: Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead.",
  "Warning: TapRating: Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead." // Bỏ qua cảnh báo này
]);

const ProductDetails = ({ route }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState("");
  const [userId, setUserId] = useState(null);
  const [rating, setRating] = useState(5);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigation = useNavigation();
  const { productId } = route.params;

  const loadProductDetails = async () => {
    try {
      const res = await APIs.get(endpoints["product-details"](productId));
      setProduct(res.data);
      setReviews(res.data.reviews || []);
    } catch (error) {
      console.error("Error loading product details:", error);
      Alert.alert("Lỗi", "Không thể tải thông tin sản phẩm. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const loadUserId = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem("user_id");
      console.log(storedUserId)
      if (storedUserId) {
        setUserId(storedUserId);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error("Error loading user ID:", error);
      Alert.alert("Lỗi", "Không thể xác định người dùng. Vui lòng thử lại!");
    }
  };

  useEffect(() => {
    loadUserId();
    loadProductDetails();
  }, [productId]);

  const handleBuyNow = () => {
    if (!isLoggedIn) {
      Alert.alert("Thông báo","Bạn cần đăng nhập để sử dụng tính năng này");
      return;
    }
    Alert.alert("Mua hàng", `Bạn đã chọn mua ${product?.name}!`);
  };

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      Alert.alert("Thông báo", "Bạn cần đăng nhập để thực hiện hành động này");
      return;
    }
  
    try {
      const res = await APIs.get(endpoints["product-details"](productId));
      const newItem = {
        id: res.data.id,
        name: res.data.name,
        price: res.data.price,
        quantity: 1,
        image: res.data.image,
      };
  
      const storedCart = await AsyncStorage.getItem("shoppingCart");
      const cart = storedCart ? JSON.parse(storedCart) : [];
  
      const existingItemIndex = cart.findIndex((item) => item.id === newItem.id);
      if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity += 1;
      } else {
        cart.push(newItem);
      }
  
      await AsyncStorage.setItem("shoppingCart", JSON.stringify(cart));
      Alert.alert("Giỏ hàng", `Đã thêm ${newItem.name} vào giỏ hàng!`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      Alert.alert("Lỗi", "Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại!");
    }
  };
  
  const postReview = async () => {
    if (!comment.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập nội dung bình luận!");
      return;
    }

    try {
      const payload = {
        user: userId,
        product: productId,
        comment: comment,
        rating: rating,
      };

      await APIs.post(endpoints["reviews"], payload);
      Alert.alert("Thành công", "Bình luận của bạn đã được gửi!");
      setComment(""); // Clear comment input after submission
      setRating(5);
      loadProductDetails(); // Reload product details to update reviews
    } catch (error) {
      console.error("Error posting review:", error);
      Alert.alert("Lỗi", "Không thể gửi bình luận. Vui lòng thử lại!");
    }
  };

  const renderReviewItem = ({ item }) => (
    <View style={ProductDetailStyles.reviewItem}>
      <Text style={ProductDetailStyles.reviewUser}>
        {item.user} ({item.rating}★)
      </Text>
      <Text style={ProductDetailStyles.reviewComment}>
        {item.comment}
      </Text>
    </View>
  );

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
    <FlatList
      data={[product]} // Wrap product details in an array to use with FlatList
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={ProductDetailStyles.container}>
          <Image
            source={{ uri: item.image }}
            style={ProductDetailStyles.productImage}
            resizeMode="cover"
          />
          <View style={ProductDetailStyles.infoContainer}>
            <Text style={ProductDetailStyles.productName}>{item.name}</Text>
            <Text style={ProductDetailStyles.productPrice}>${item.price}</Text>
            <Text style={ProductDetailStyles.productStock}>
              Số lượng còn: {item.stock_quantity}
            </Text>
            <Text style={ProductDetailStyles.productDescription}>
              {item.description || "Mô tả sản phẩm chưa được cập nhật."}
            </Text>
          </View>

          {/* Button for buying product */}
          <TouchableOpacity
            style={ProductDetailStyles.buyButton}
            onPress={handleBuyNow}
          >
            <Text style={ProductDetailStyles.buyButtonText}>
              Mua ngay
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={ProductDetailStyles.addToCartButton}
            onPress={handleAddToCart}
          >
            <Text style={ProductDetailStyles.addToCartButtonText}>
              Thêm vào giỏ hàng
            </Text>
          </TouchableOpacity>

          {/* Reviews Section */}
          <View style={ProductDetailStyles.reviewsContainer}>
            <Text style={ProductDetailStyles.reviewsHeader}>Đánh giá sản phẩm</Text>
            {reviews.length > 0 ? (
              <FlatList
                data={reviews}
                renderItem={renderReviewItem}
                keyExtractor={(item, index) => index.toString()}
              />
            ) : (
              <Text style={ProductDetailStyles.noReviewsText}>
                Chưa có đánh giá nào.
              </Text>
            )}
          </View>

          {/* Add review form */}
          {isLoggedIn && (
            <View style={ProductDetailStyles.addReviewContainer}>
              <Text style={ProductDetailStyles.addReviewHeader}>Viết đánh giá</Text>

              <AirbnbRating
                count={5}
                rating={rating}
                size={30}
                onFinishRating={(rate) => setRating(rate)}
                fullStarColor="gold"
              />
              <TextInput
                style={ProductDetailStyles.commentInput}
                placeholder="Nhập bình luận của bạn..."
                value={comment}
                onChangeText={(text) => setComment(text)}
                multiline
              />
              <TouchableOpacity
                style={ProductDetailStyles.submitButton}
                onPress={postReview}
              >
                <Text style={ProductDetailStyles.submitButtonText}>Gửi</Text>
              </TouchableOpacity>
            </View>
          )}
          {!isLoggedIn && (
            <View style={ProductDetailStyles.notLoggedInContainer}>
              <Text style={ProductDetailStyles.notLoggedInText}>
                Bạn cần đăng nhập để thực hiện hành động này. Vui lòng đăng nhập.
              </Text>
            </View>
          )}
        </View>
      )}
    />
  );
};

export default ProductDetails;
