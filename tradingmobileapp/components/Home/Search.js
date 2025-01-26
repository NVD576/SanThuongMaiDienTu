import React, { useEffect, useState } from 'react';
import { FlatList, TextInput, View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Thư viện icon
import SearchStyles from "../Home/SearchStyles";
import APIs, { endpoints } from '../../configs/APIs';

const Search = () => {
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState({});
  const [filters, setFilters] = useState({
    name: '',
    minPrice: '',
    maxPrice: '',
    store: '',
  });

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortOption, setSortOption] = useState('name');

  const loadProducts = async () => {
    try {
      const res = await APIs.get(endpoints["products"]);
      setProducts(res.data.results);
      setFilteredProducts(res.data.results);
    } catch (error) {
      console.error("Lỗi khi tải sản phẩm:", error);
    }
  };

  const loadStores = async () => {
    try {
      const res = await APIs.get(endpoints["stores"]);
      const storeData = {};
      res.data.results.forEach((store) => {
        storeData[store.id] = store.name;
      });
      setStores(storeData);
    } catch (error) {
      console.error("Lỗi khi tải thông tin cửa hàng:", error);
    }
  };

  const handleSearch = () => {
    let results = products.filter((product) => {
      const isNameMatch = product.name
        .toLowerCase()
        .includes(filters.name.toLowerCase());
      const isPriceMatch =
        (!filters.minPrice || product.price >= parseFloat(filters.minPrice)) &&
        (!filters.maxPrice || product.price <= parseFloat(filters.maxPrice));
      const isStoreMatch = stores[product.store]?.toLowerCase()?.includes(filters.store.toLowerCase());
      return isNameMatch && isPriceMatch && isStoreMatch;
    });

    results = results.sort((a, b) => {
      if (sortOption === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortOption === 'price') {
        return a.price - b.price;
      }
    });

    setFilteredProducts(results);
    setCurrentPage(1);
    setTotalPages(Math.ceil(results.length / 20));
  };

  useEffect(() => {
    loadProducts();
    loadStores();
  }, []);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * 20,
    currentPage * 20
  );

  return (
    <View style={SearchStyles.container}>
      <Text style={SearchStyles.title}>Tìm kiếm sản phẩm</Text>

      {/* Bộ lọc */}
      <View style={SearchStyles.filterContainer}>
        <TextInput
          style={SearchStyles.input}
          placeholder="Tên sản phẩm"
          value={filters.name}
          onChangeText={(text) => setFilters({ ...filters, name: text })}
        />
        <TextInput
          style={SearchStyles.input}
          placeholder="Giá tối thiểu"
          keyboardType="numeric"
          value={filters.minPrice}
          onChangeText={(text) => setFilters({ ...filters, minPrice: text })}
        />
        <TextInput
          style={SearchStyles.input}
          placeholder="Giá tối đa"
          keyboardType="numeric"
          value={filters.maxPrice}
          onChangeText={(text) => setFilters({ ...filters, maxPrice: text })}
        />
        <TextInput
          style={SearchStyles.input}
          placeholder="Cửa hàng"
          value={filters.store}
          onChangeText={(text) => setFilters({ ...filters, store: text })}
        />
      </View>

      {/* Sắp xếp */}
      <View style={SearchStyles.sortContainer}>
        <TouchableOpacity onPress={() => setSortOption('name')} style={SearchStyles.sortButton}>
          <Ionicons name="text" size={20} color="#007bff" />
          <Text style={SearchStyles.sortText}>Tên</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSortOption('price')} style={SearchStyles.sortButton}>
          <Ionicons name="pricetag" size={20} color="#007bff" />
          <Text style={SearchStyles.sortText}>Giá</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSearch} style={SearchStyles.searchButton}>
          <Text style={SearchStyles.searchText}>Tìm kiếm</Text>
        </TouchableOpacity>
      </View>

      {/* Danh sách sản phẩm */}
      <FlatList
        data={paginatedProducts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={SearchStyles.productItem}>
            <Image
              source={{ uri: item.image }}
              style={SearchStyles.productImage}
            />
            <View style={SearchStyles.productInfo}>
              <Text style={SearchStyles.productName}>{item.name}</Text>
              <Text style={SearchStyles.productPrice}>{item.price} VND</Text>
              <Text style={SearchStyles.productStore}>
                {stores[item.store] || 'Cửa hàng không xác định'}
              </Text>
            </View>
          </View>
        )}
      />

      {/* Phân trang */}
      <View style={SearchStyles.paginationContainer}>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <TouchableOpacity
            key={page}
            style={[
              SearchStyles.pageButton,
              currentPage === page && SearchStyles.pageButtonActive,
            ]}
            onPress={() => setCurrentPage(page)}
          >
            <Text
              style={[
                SearchStyles.pageText,
                currentPage === page && SearchStyles.pageTextActive,
              ]}
            >
              {page}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default Search;
