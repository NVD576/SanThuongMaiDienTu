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
  const [page, setPage] = useState(1);
  const navigation = useNavigation();

  const loadProducts = async () => {
    if (page > 0) {
      try {
        setLoading(true);
        let url = `${endpoints["products"]}?page=${page}`;
        if (cateId !== null) {
          url = `${endpoints["products"]}?category=${cateId}&page=${page}`;
        }
        let res = await APIs.get(url);
  
        if (res.data.results.length > 0) {
          if (page > 1) {
            setProducts((current) => [...current, ...res.data.results]);
          } else {
            setProducts(res.data.results);
          }
  
          if (res.data.next === null) {
            setPage(0);
          }
        } else {
          setPage(0);
        }
      } catch (error) {
        if (error.response?.status === 404) {
          setPage(0);
        } else {
          console.error("Error loading products:", error.message);
        }
      } finally {
        setLoading(false);
      }
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
  }, [cateId, page]);

  useEffect(() => {
    loadCategories();
    loadStores();
  }, []);

  const loadMore = () => {
    if (page > 0 && !loading)
      setPage(page+1)
  }

  return (
    <View style={HomeStyles.container}>
      <Text style={HomeStyles.title}>🛍️ Danh Sách Sản Phẩm</Text>

      {/* Categories */}
      <ScrollView
        horizontal
        style={HomeStyles.categoryScroll}
        showsHorizontalScrollIndicator={false}
      >
        <TouchableOpacity
          onPress={() => {
            setCateId(null); // Cập nhật danh mục là 'Tất cả'
            setPage(1); // Reset về trang đầu
            setProducts([]); // Xóa danh sách sản phẩm cũ
          }}
        >
          <Chip
            icon="label-outline"
            selected={cateId === null} // Đánh dấu Chip được chọn
            style={[
              HomeStyles.categoryChip,
              cateId === null ? HomeStyles.selectedChip : null,
            ]}
            textStyle={HomeStyles.categoryChipText}
          >
            Tất cả
          </Chip>
        </TouchableOpacity>
        {categories.map((c) => (
          <TouchableOpacity
            key={c.id}
            onPress={() => {
              setCateId(c.id); // Cập nhật cateId khi nhấn
              setPage(1); // Reset về trang đầu
              setProducts([]); // Xóa danh sách sản phẩm cũ
            }}
          >
            <Chip
              icon="label-outline"
              selected={cateId === c.id} // Đánh dấu Chip được chọn
              style={[
                HomeStyles.categoryChip,
                cateId === c.id ? HomeStyles.selectedChip : null,
              ]}
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
          onEndReached={loadMore}
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
