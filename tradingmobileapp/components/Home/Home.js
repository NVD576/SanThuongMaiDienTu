import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { Chip } from "react-native-paper";
import HomeStyles from "../Home/HomeStyles";
import APIs, { endpoints } from "../../configs/APIs";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [cateId, setCateId] = useState(null);
  const [stores, setStores] = useState({});
  const navigation = useNavigation();

  const loadProducts = async () => {
    try {
      let url = endpoints["products"];
      if (cateId !== null) {
        url = `${url}?category=${cateId}`;
      }
      let res = await APIs.get(url);
      setProducts(res.data.results);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      let res = await APIs.get(endpoints["categories"]);
      setCategories(res.data.results);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const loadStores = async () => {
    try {
      let res = await APIs.get(endpoints["stores"]);
      const storeData = {};
      res.data.results.forEach((store) => {
        storeData[store.id] = store.name;
      });
      setStores(storeData);
    } catch (error) {
      console.error("Error loading stores:", error);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [cateId]);

  useEffect(() => {
    loadCategories();
    loadStores();
  }, []);

  return (
    <View style={HomeStyles.container}>
      <Text style={HomeStyles.title}>🛍️ Danh Sách Sản Phẩm</Text>

      {/* Categories */}
      <ScrollView
        horizontal
        style={HomeStyles.categoryScroll}
        showsHorizontalScrollIndicator={false}
      >
        <TouchableOpacity onPress={() => setCateId(null)}>
          <Chip
            icon="label-outline"
            style={HomeStyles.categoryChip}
            textStyle={HomeStyles.categoryChipText}
          >
            Tất cả
          </Chip>
        </TouchableOpacity>
        {categories.map((c) => (
          <TouchableOpacity key={c.id} onPress={() => setCateId(c.id)}>
            <Chip
              icon="label-outline"
              style={HomeStyles.categoryChip}
              textStyle={HomeStyles.categoryChipText}
            >
              {c.name}
            </Chip>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Products */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#4CAF50"
          style={HomeStyles.loading}
        />
      ) : (
        <FlatList
          data={products}
          numColumns={2}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={HomeStyles.productList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={HomeStyles.productCard}
              onPress={() =>
                navigation.navigate("ProductDetails", { productId: item.id })
              }
            >
              <Image
                source={{ uri: item.image }}
                style={HomeStyles.productImage}
                resizeMode="cover"
              />
              <View style={HomeStyles.productInfo}>
                <Text style={HomeStyles.productName} numberOfLines={1}>
                  {item.name}
                </Text>
                <View style={HomeStyles.ratingContainer}>
                  {[...Array(5)].map((_, index) => (
                    <FontAwesome
                      key={index}
                      name={index < Math.floor(item.rating) ? "star" : "star-o"}
                      size={16}
                      color="#FFD700"
                    />
                  ))}
                </View>
                <Text>Giá: {item.price} VND</Text>
                <Text style={HomeStyles.storeName}>
                  {stores[item.store] || "Cửa hàng không xác định"}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default Home;
