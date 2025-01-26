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
});

export default ProductDetailStyles;
