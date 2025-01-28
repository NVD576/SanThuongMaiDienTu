import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { format } from "date-fns";
import { authApis, endpoints } from "../../configs/APIs";
import { Picker } from '@react-native-picker/picker';
import styles from "../Home/BillStyles";

const Bill = ({ route }) => {
  const { orderId } = route.params;
  const [order, setOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("money"); // Default payment method
  const navigation = useNavigation();

  const loadOrderDetails = async () => {
    try {
      const authAPI = await authApis();
      const orderRes = await authAPI.get(endpoints["order"] + orderId);
      const orderData = orderRes.data;
      console.log("Order Data:", orderData);
      setOrder(orderData);

      const orderItemsRes = await authAPI.get(endpoints["order-item"]);
      const orderItemsData = orderItemsRes.data.results;

      const filteredOrderItems = orderItemsData.filter(item => item.order === orderId);
      setOrderItems(filteredOrderItems);
    } catch (error) {
      console.error("Error loading order details:", error);
    }
  };

  useEffect(() => {
    loadOrderDetails();
  }, [orderId]);

  const formatDate = (dateString) => {
    return format(new Date(dateString), "dd/MM/yyyy HH:mm:ss");
  };

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderItemContainer}>
      <Text style={styles.productName}>Sản phẩm ID: {item.product}</Text>
      <Text style={styles.productPrice}>Giá: ${item.price}</Text>
      <Text style={styles.productQuantity}>Số lượng: {item.quantity}</Text>
      <Text style={styles.itemTotalPrice}>
        Tổng giá: ${(item.price * item.quantity).toFixed(2)}
      </Text>
    </View>
  );

  const handlePayment = () => {
    alert(`Thanh toán bằng phương thức: ${selectedPaymentMethod}`);
    // Logic thanh toán có thể được xử lý tại đây
  };

  if (!order) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Đang tải thông tin hóa đơn...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Thông tin Hóa Đơn</Text>

      <View style={styles.orderInfo}>
        <Text style={styles.infoText}>Mã đơn hàng: {order.id}</Text>
        <Text style={styles.infoText}>Ngày tạo: {formatDate(order.created_at)}</Text>
        <Text style={styles.infoText}>Tổng giá trị: ${order.total_price}</Text>
        <Text style={styles.infoText}>Trạng thái: {order.status}</Text>
      </View>

      {/* Phương thức thanh toán */}
      <View style={styles.paymentMethodContainer}>
        <Text style={styles.paymentMethodLabel}>Chọn phương thức thanh toán</Text>
        <Picker
          selectedValue={selectedPaymentMethod}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedPaymentMethod(itemValue)}
        >
          <Picker.Item label="Tiền mặt" value="money" />
          <Picker.Item label="PayPal" value="papal" />
          <Picker.Item label="Momo" value="momo" />
          <Picker.Item label="Stripe" value="stripe" />
          <Picker.Item label="ZaloPay" value="zalopay" />
        </Picker>
      </View>

      {/* Render order items if they exist */}
      <FlatList
        data={orderItems}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id.toString()}
      />

      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Tổng giá trị đơn hàng: ${order.total_price}</Text>
      </View>

      {/* Nút thanh toán */}
      <TouchableOpacity
        style={styles.paymentButton}
        onPress={handlePayment}
      >
        <Text style={styles.buttonText}>Thanh toán</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Quay lại</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Bill;
