import React, { useContext, useState } from "react";
import { Text, View, TextInput, TouchableOpacity, Alert } from "react-native";
import APIs, { authApis, endpoints } from "../../configs/APIs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MyDispatchContext, MyUserContext } from "../../configs/UserContexts";
import styles from "./LoginStyles";

const Login = ({ navigation }) => {
    const [user, setUser] = useState({
        "username": "",
        "password": "",
    });

    const [loading, setLoading] = useState(false);

    const dispatch = useContext(MyDispatchContext);

    const { loginInfo } = useContext(MyUserContext); 

    const updateUser = (value, field) => {
        setUser({ ...user, [field]: value });
    };

    const login = async () => {
        try {
            setLoading(true);
            console.log("Trying to login...");
    
            const res = await APIs.post(endpoints['login'], {
                client_id: "utwiObUkAqZq7CdZ15JPVegzdGvHqLBZnKXkVfrc",
                client_secret: "ovUhk6GvUyQB9WNmOfPZ4YJUhBHu8IfXICFgGTANJkxqzG1bcIqfrfF2ARjczzDwwquoGNtn2HglwLieG3ovPxSBtFK8Dfv8tKEhSz2CLbeQPkTFe1CsrvW3q5ASGLhb",
                grant_type: "password",
                username: user.username,
                password: user.password,
            }, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                }
            });

            await AsyncStorage.setItem('token', res.data.access_token);
            console.log('Token saved:', res.data.access_token);

            const authAPI = await authApis();
            const userRes = await authAPI.get(endpoints['current-user']);

            if (userRes.data.approval_status === 'rejected'||userRes.data.approval_status === 'pending') {
                Alert.alert("Đang chờ xét duyệt", "Tài khoản của bạn đang được xét duyệt, vui lòng liên hệ quản trị viên.");
                return;
            }

            await AsyncStorage.setItem("user_id", userRes.data.id.toString());
            const storedCart = await AsyncStorage.getItem(`shoppingCart_${userRes.data.id}`);
            if (storedCart) {
                await AsyncStorage.setItem(`shoppingCart_${userRes.data.id}`, storedCart);
            } else {
                await AsyncStorage.setItem(`shoppingCart_${userRes.data.id}`, JSON.stringify([]));
            }

            dispatch({
                type: "login",
                payload: userRes.data,
            });

            loginInfo(userRes.data);

            navigation.navigate("Home");

            navigation.reset({
                index: 0,
                routes: [{ name: "Home" }]
            });
        } catch (ex) {
            console.log("ex: "+ ex)
            Alert.alert("Đăng nhập thất bại", "Tên đăng nhập hoặc mật khẩu không đúng.");
        } finally {
            setLoading(false);
        }
    };



    const register=()=>{

    }
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Đăng nhập</Text>

            <TextInput
                style={styles.input}
                placeholder="Tên đăng nhập"
                placeholderTextColor="#888"
                keyboardType="default"
                autoCapitalize="none"
                value={user.username}
                onChangeText={t => updateUser(t, "username")}
            />

            <TextInput
                style={styles.input}
                placeholder="Mật khẩu"
                placeholderTextColor="#888"
                secureTextEntry={true}
                value={user.password}
                onChangeText={t => updateUser(t, "password")}
            />

            <TouchableOpacity
                style={[styles.button, loading && { backgroundColor: "#999" }]}
                onPress={login}
                disabled={loading}
            >
                <Text style={styles.buttonText}>{loading ? "Đang xử lý..." : "Đăng nhập"}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.row}>
                <Text style={styles.forgotPassword}>Quên mật khẩu?</Text>
                <Text onPress={() => navigation.navigate("Register")} style={styles.register}>Đăng ký</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Login;