import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Home from './components/Home/Home';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Tú đầu buồi</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Chiếm toàn bộ màn hình
    justifyContent: 'center', // Căn giữa theo trục dọc
    alignItems: 'center', // Căn giữa theo trục ngang
    backgroundColor: '#f0f0f0', // Màu nền (tuỳ chọn)
  },
  text: {
    fontSize: 18, // Kích thước chữ (tuỳ chọn)
    color: '#333', // Màu chữ (tuỳ chọn)
  },
});
