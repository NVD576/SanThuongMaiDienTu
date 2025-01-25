import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window'); // Lấy chiều rộng của màn hình

const StoreProductStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  productList: {
    justifyContent: 'center',
    paddingBottom: 20,
  },
  productCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    overflow: 'hidden',
    margin: 8,
    width: width / 2 - 24, // Mỗi card chiếm 50% chiều rộng màn hình
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    height: 250, // Chiều cao cố định cho card
  },
  productImage: {
    width: '100%',
    height: 150, // Chiều cao cố định cho hình ảnh
    borderBottomWidth: 1, // Để tách phần ảnh và thông tin
    borderColor: '#ddd',
  },
  productInfo: {
    padding: 8,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    color: '#6200ee',
    marginBottom: 4,
  },
  productStock: {
    fontSize: 12,
    color: '#666',
  },
});

export default StoreProductStyles;
