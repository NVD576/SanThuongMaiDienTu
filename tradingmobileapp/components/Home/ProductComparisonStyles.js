import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  productItem: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  productImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  productPrice: {
    color: "#4CAF50",
  },
  productRating: {
    color: "#FFD700",
  },
  storeName: {
    color: "#555",
  },
});
