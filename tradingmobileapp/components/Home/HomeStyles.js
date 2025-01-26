import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const HomeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 16, // Thêm padding toàn bộ màn hình để không bị chặt
  },
  title: {
    fontSize: 28, // Tăng kích thước chữ cho tiêu đề
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginVertical: 16,
  },
  categoryScroll: {
    paddingVertical: 8, // Tăng khoảng cách trên và dưới cho danh sách danh mục
    marginBottom: 16,
  },
  categoryChip: {
    backgroundColor: "#E0F7FA",
    marginRight: 12, // Tăng khoảng cách giữa các chip danh mục
    marginBottom: 8, // Thêm khoảng cách giữa các chip theo chiều dọc
    borderRadius: 16, // Làm bo tròn các góc của chip
  },
  categoryChipText: {
    color: "#00796B",
    fontSize: 14, // Tăng kích thước chữ cho chip
  },
  loading: {
    marginTop: 20,
  },
  productList: {
    paddingHorizontal: 4, // Giảm padding xung quanh danh sách sản phẩm
  },
  productCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    paddingBottom: 12, // Thêm khoảng cách dưới cùng để tạo không gian giữa card và text
  },
  productImage: {
    width: "100%",
    height: 220, // Tăng chiều cao của hình ảnh sản phẩm
    borderTopLeftRadius: 8, // Bo tròn góc trên trái của hình ảnh
    borderTopRightRadius: 8, // Bo tròn góc trên phải của hình ảnh
  },
  productInfo: {
    paddingHorizontal: 12,
    paddingTop: 8, // Tăng khoảng cách giữa hình ảnh và thông tin
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
    numberOfLines: 1,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  productCardTouchable: {
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 16,
  },
});

export default HomeStyles;
