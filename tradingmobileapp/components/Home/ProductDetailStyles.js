import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const ProductDetailStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  productImage: {
    width: width,
    height: 300,
    marginBottom: 16,
  },
  infoContainer: {
    padding: 16,
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    marginTop: -20, // Đẩy phần thông tin lên chồng lên ảnh
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 20,
    color: "#4CAF50",
    fontWeight: "bold",
    marginBottom: 8,
  },
  productStock: {
    fontSize: 16,
    color: "#777",
    marginBottom: 8,
  },
  productDescription: {
    fontSize: 16,
    color: "#555",
    lineHeight: 22,
  },
  buyButton: {
    backgroundColor: "#FF5722",
    padding: 15,
    borderRadius: 50,
    margin: 16,
    alignItems: "center",
  },
  buyButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: "#555",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "#d32f2f",
    textAlign: "center",
  },


  reviewsContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    paddingVertical: 16,
  },
  reviewsHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  reviewItem: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 8,
  },
  reviewUser: {
    fontWeight: "bold",
    color: "#555",
  },
  reviewComment: {
    color: "#666",
    marginTop: 4,
  },
  noReviewsText: {
    fontStyle: "italic",
    color: "#888",
    textAlign: "center",
  },


  addReviewContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
  },
  addReviewHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    height: 80,
    textAlignVertical: "top",
    backgroundColor: "#fff",
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  

});

export default ProductDetailStyles;
