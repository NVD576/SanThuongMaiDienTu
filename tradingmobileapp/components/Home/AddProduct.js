import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import APIs, { authApis, endpoints } from "../../configs/APIs";
import styles from "./AddProductStyles";
import { Picker } from "@react-native-picker/picker";

const AddProduct = ({ navigation }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [categories, setCategories] = useState([]);
  const [stores, setStores] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStore, setSelectedStore] = useState("");

  const fetchCategories = async () => {
    try {
      const response = await APIs.get(endpoints.categories)
      const data=response.data;
      if (Array.isArray(data.results) && data.results.length > 0) {
        setCategories(data.results); // Lấy dữ liệu từ "results"
      } else {
        setCategories([]); // Nếu không có danh mục, gán mảng rỗng
      }
    } catch (error) {
      console.error("Lỗi khi tải danh mục:", error);
      setCategories([]); // Gán mảng rỗng nếu có lỗi
    }
  };

  const fetchStores = async () => {
    try {
      const userId = await AsyncStorage.getItem("user_id");
      console.log("userid: "+userId)
      const response = await APIs.get(endpoints.stores, {
        params: { seller: userId }
      });

      console.log("Danh sách danh mục: ", response.data.results); // Log danh sách categories từ "results"
      if (Array.isArray(response.data.results) && response.data.results.length > 0) {
        const filteredStores = response.data.results.filter(store => store.seller.toString() === userId);
        setStores(filteredStores);
      } else {
        setStores([]); 
      }
    } catch (error) {
      console.error("Lỗi khi tải cửa hàng:", error);
      setStores([]); 
    }
  };

  const pickImage = async () => {
    let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Bạn cần cấp quyền để chọn ảnh.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0]);
    }
  };

  const addProduct = async () => {
    if (
      !name ||
      !description ||
      !price ||
      !stockQuantity ||
      !selectedStore ||
      !selectedCategory
    ) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin sản phẩm!");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Lỗi", "Bạn chưa đăng nhập!");
        return;
      }

      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("stock_quantity", stockQuantity);
      formData.append("active", "True");
      formData.append("rating", "3");
      formData.append("store", selectedStore);
      formData.append("category", selectedCategory);

      if (avatar) {
        const filename = avatar.uri.split("/").pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;

        formData.append("image", {
          uri: avatar.uri,
          name: filename,
          type,
        });
      }

      const response = await fetch(`${BASE_URL}/products/`, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const responseText = await response.text();
      console.log("Response Text:", responseText);
      let responseData;
      try {
        responseData = JSON.parse(responseText); // Try parsing the response text
      } catch (e) {
        console.error("Error parsing response:", e);
        responseData = {}; // Fallback if JSON parsing fails
      }
      if (response.ok) {
        // const successData = await response.json();
        Alert.alert("Thành công", "Sản phẩm đã được thêm!");
        navigation.goBack();
      } else {
        // const errorData = await response.json();
        Alert.alert("Lỗi", responseData.message || "Không thể thêm sản phẩm!");
        console.log(responseData.message);
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
      Alert.alert("Lỗi", "Không thể kết nối đến server!");
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchStores();
  }, []);
  useEffect(() => {
    if (categories.length > 0) {
      setSelectedCategory(categories[0].id);
    }
  }, [categories]);

  useEffect(() => {
    if (stores.length > 0) {
      setSelectedStore(stores[0].id);
    }
  }, [stores]);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thêm Sản Phẩm</Text>

      <TextInput
        style={styles.input}
        placeholder="Tên sản phẩm"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Mô tả sản phẩm"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Giá sản phẩm"
        keyboardType="numeric"
        value={price}
        onChangeText={(text) => setPrice(text.replace(/[^0-9]/g, ""))} // Chỉ giữ lại số
      />

      <TextInput
        style={styles.input}
        placeholder="Số lượng tồn kho"
        keyboardType="numeric"
        value={stockQuantity}
        onChangeText={(text) => setStockQuantity(text.replace(/[^0-9]/g, ""))} // Chỉ giữ lại số
      />

      <Text>Chọn Cửa Hàng</Text>
      <Picker
        selectedValue={selectedStore}
        onValueChange={(itemValue) => setSelectedStore(itemValue)}
      >
        {stores.length > 0 ? (
          stores.map((store) => (
            <Picker.Item key={store.id} label={store.name} value={store.id} />
          ))
        ) : (
          <Picker.Item label="Không có cửa hàng" value="" />
        )}
      </Picker>

      <Text>Chọn Danh Mục</Text>
      <Picker
        selectedValue={selectedCategory}
        onValueChange={(itemValue) => setSelectedCategory(itemValue)}
      >
        {categories.length > 0 ? (
          categories.map((category) => (
            <Picker.Item
              key={category.id}
              label={category.name}
              value={category.id}
            />
          ))
        ) : (
          <Picker.Item label="Không có danh mục" value="" />
        )}
      </Picker>

      <TouchableOpacity onPress={pickImage}>
        {avatar ? (
          <Image source={{ uri: avatar.uri }} style={styles.image} />
        ) : (
          <Text>Chọn ảnh đại diện</Text>
        )}
      </TouchableOpacity>

      <Button title="Thêm sản phẩm" onPress={addProduct} />
    </View>
  );
};

export default AddProduct;
