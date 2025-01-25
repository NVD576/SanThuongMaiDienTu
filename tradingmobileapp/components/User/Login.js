import React, { useContext, useState } from "react";
import { Text, View, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import APIs, { authApis, endpoints } from "../../configs/APIs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MyDispatchContext, MyUserContext } from "../../configs/UserContexts";

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
                client_id: "ge59pWUzpzowHvx2jPtVvkv0Eps9O91sDOSspEzg",
                client_secret: "IH6sHyRX6F2CrQrVnjUPlRLR8Baa44LybMKe118IrbcWbyk9lsqm0kJje5uL24U9uPVTMTSJGw67jrx4g4zxuRniQRbLFjX0Y3jgzQ5FPvULqjgmsu4k8nqDRvQQwEFr",
                grant_type: "password",
                username: user.username,
                password: user.password,
            }, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                }
            });

            console.info("Login response:", res.data);

            await AsyncStorage.setItem('token', res.data.access_token);

            const authAPI = await authApis();
            const userRes = await authAPI.get(endpoints['current-user']);
            console.info("Current user:", userRes.data);

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
            console.error("Login failed:", ex.response ? ex.response.data : ex.message);
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 30,
    },
    input: {
        width: "100%",
        height: 50,
        backgroundColor: "#fff",
        borderRadius: 8,
        paddingHorizontal: 15,
        fontSize: 16,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    button: {
        width: "100%",
        height: 50,
        backgroundColor: "#4CAF50",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
        marginTop: 10,
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
    },
    forgotPassword: {
        fontSize: 14,
        color: "#007BFF",
        textDecorationLine: "underline",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 15,
        width: "100%",
    },
    register: {
        fontSize: 14,
        color: "#007BFF",
        textDecorationLine: "underline",
    },
});

export default Login;
