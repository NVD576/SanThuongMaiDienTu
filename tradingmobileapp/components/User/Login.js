import React, { useContext, useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import APIs, { authApis, endpoints } from "../../configs/APIs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MyDispatchContext, MyUserContext } from "../../configs/UserContexts";
import styles from "./LoginStyles";

const Login = ({ navigation }) => {
  const [user, setUser] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useContext(MyDispatchContext);
  const { loginInfo } = useContext(MyUserContext);

  const updateUser = (value, field) => {
    setUser({ ...user, [field]: value });
    setError(""); // Xóa lỗi khi người dùng nhập lại
  };

  const login = async () => {
    if (!user.username || !user.password) {
      setError("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      setLoading(true);
      const res = await APIs.post(
        endpoints["login"],
        {
          grant_type: "password",
          username: user.username,
          password: user.password,
        },
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );

      await AsyncStorage.setItem("token", res.data.access_token);
      console.log("Token saved:", res.data.access_token);

      const authAPI = await authApis();
      const userRes = await authAPI.get(endpoints["current-user"]);

      await AsyncStorage.setItem("user_id", userRes.data.id.toString());

      dispatch({ type: "login", payload: userRes.data });
      loginInfo(userRes.data);

      navigation.reset({ index: 0, routes: [{ name: "Home" }] });
    } catch (ex) {
      console.error("Login failed:", ex.response ? ex.response.data : ex.message);
      setError("Tên đăng nhập hoặc mật khẩu không đúng.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#6a11cb", "#2575fc"]} style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Đăng nhập</Text>

        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="#888" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Tên đăng nhập"
            placeholderTextColor="#ccc"
            value={user.username}
            onChangeText={(t) => updateUser(t, "username")}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#888" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Mật khẩu"
            placeholderTextColor="#ccc"
            secureTextEntry={true}
            value={user.password}
            onChangeText={(t) => updateUser(t, "password")}
          />
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.button, loading && { backgroundColor: "#999" }]}
          onPress={login}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Đăng nhập</Text>}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.forgotPassword}>Quên mật khẩu?</Text>
          <Text onPress={() => navigation.navigate("Register")} style={styles.register}>
            Đăng ký
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
};

export default Login;
