import React from 'react';
import { Button, FlatList, TextInput, View, Text } from 'react-native';
import SearchStyles from "../Home/SearchStyles";

const Search = () => {

  return (
    <View style={SearchStyles.container}>
      <TextInput
        style={SearchStyles.input}
        placeholder="Tên sản phẩm"
      />
      <TextInput
        style={SearchStyles.input}
        placeholder="Giá tối thiểu"
        keyboardType="numeric"
      />
      <TextInput
        style={SearchStyles.input}
        placeholder="Giá tối đa"
        keyboardType="numeric"
      />
      <TextInput
        style={SearchStyles.input}
        placeholder="Cửa hàng"
      />
      
      <View style={SearchStyles.sortContainer}>
        <Button title="Sắp xếp theo tên" onPress={() => {}} />
        <Button title="Sắp xếp theo giá" onPress={() => {}} />
      </View>

      <Button title="Tìm kiếm" onPress={() => {}} />

      <FlatList
        data={[{ id: 1, name: 'Sản phẩm 1', price: '100000', store: 'Cửa hàng 1' }]}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={SearchStyles.productItem}>
            <Text>{item.name}</Text>
            <Text>{item.price}</Text>
            <Text>{item.store}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default Search;
