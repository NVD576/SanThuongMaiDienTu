import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  ActivityIndicator,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import ProductDetailStyles from "./ProductDetailStyles";
import APIs, { endpoints } from "../../configs/APIs";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AirbnbRating } from 'react-native-ratings'; 

const ProductDetails = ({ route }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState("");
  const [userId, setUserId] = useState(null);
  const [rating, setRating] = useState(5);
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
      if (!storedUserId) {
        navigation.navigate("Login"); // Redirect to login if no user ID found
      } else {
        setUserId(storedUserId); // Store user ID if it exists
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

  const postReview = async () => {
    if (!userId) {
      navigation.navigate("Login");
      return;
    }
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

      <View style={ProductDetailStyles.reviewsContainer}>
        <Text style={ProductDetailStyles.reviewsHeader}>Đánh giá sản phẩm</Text>
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <View key={index} style={ProductDetailStyles.reviewItem}>
              <Text style={ProductDetailStyles.reviewUser}>
                {review.user} ({review.rating}★)
              </Text>
              <Text style={ProductDetailStyles.reviewComment}>
                {review.comment}
              </Text>
            </View>
          ))
        ) : (
          <Text style={ProductDetailStyles.noReviewsText}>
            Chưa có đánh giá nào.
          </Text>
        )}
      </View>

      <View style={ProductDetailStyles.addReviewContainer}>
        <Text style={ProductDetailStyles.addReviewHeader}>Viết đánh giá</Text>
{/* 
        <StarRating
          disabled={false}
          maxStars={5}
          rating={rating}
          fullStarColor="gold"
          starSize={30}
          selectedStar={(rate) => setRating(rate)}
        /> */}
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
    </ScrollView>
  );
};

export default ProductDetails;
