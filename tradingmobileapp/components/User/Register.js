import { View, Image, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, Alert } from "react-native";
import { Button, RadioButton, TextInput } from "react-native-paper";
import * as ImagePicker from 'expo-image-picker';
import { useState } from "react";
import APIs, { endpoints } from "../../configs/APIs";
import { useNavigation } from "@react-navigation/native";
// import styles from "../User/RegisterStyles";

const Register = () => {
    const [user, setUser] = useState({
        "username": "",
        "password": "",
        "email": "",
        "role": "buyer", 
        "first_name": "",
        "last_name": "", 
        "confirm": ""
    });
    const [avatar, setAvatar] = useState(null);
    const [loading, setLoading] = useState(false);
    const nav = useNavigation();

    const updateUser = (value, field) => setUser({ ...user, [field]: value });

    const pickImage = async () => {
        let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') return alert("Bạn cần cấp quyền để chọn ảnh.");
        
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.Images,
            allowsEditing: true, aspect: [1, 1], quality: 0.8
        });
        
        if (!result.canceled) setAvatar(result.assets[0]);
    };

    const validateInput = () => {
        if (!user.username || !user.password || !user.email || !user.first_name || !user.last_name) {
            Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin.");
            return false;
        }
        if (user.password !== user.confirm) {
            Alert.alert("Lỗi", "Mật khẩu và xác nhận không khớp.");
            return false;
        }
        return true;
    };

    const register = async () => {
        if (!validateInput()) return;
        setLoading(true);
        try {
            const form = new FormData();
            Object.keys(user).forEach(key => { if (key !== 'confirm') form.append(key, user[key]); });
            if (avatar) form.append('avatar', { uri: avatar.uri, name: 'avatar.jpg', type: 'image/jpeg' });
            
            await APIs.post(endpoints['register'], form, {
                headers: { 'Content-Type': 'multipart/form-data', 'Accept': 'application/json' },
            });

            Alert.alert("Thành công", "Đăng ký thành công.");
            nav.goBack();
        } catch (error) {
            Alert.alert("Lỗi", error.response?.data?.message || "Đăng ký thất bại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Đăng ký tài khoản</Text>
                <TextInput mode="outlined" label="Tên" value={user.first_name} onChangeText={(t) => updateUser(t, 'first_name')} style={styles.input} />
                <TextInput mode="outlined" label="Họ và tên lót" value={user.last_name} onChangeText={(t) => updateUser(t, 'last_name')} style={styles.input} />
                <TextInput mode="outlined" label="Tên đăng nhập" value={user.username} onChangeText={(t) => updateUser(t, 'username')} style={styles.input} />
                <TextInput mode="outlined" label="Email" keyboardType="email-address" value={user.email} onChangeText={(t) => updateUser(t, 'email')} style={styles.input} />
                <TextInput mode="outlined" label="Mật khẩu" secureTextEntry value={user.password} onChangeText={(t) => updateUser(t, 'password')} style={styles.input} />
                <TextInput mode="outlined" label="Xác nhận mật khẩu" secureTextEntry value={user.confirm} onChangeText={(t) => updateUser(t, 'confirm')} style={styles.input} />
                
                <Text style={styles.label}>Chọn vai trò:</Text>
                <RadioButton.Group onValueChange={(value) => updateUser(value, 'role')} value={user.role}>
                    <RadioButton.Item label="Người dùng cá nhân" value="buyer" />
                    <RadioButton.Item label="Doanh nghiệp" value="seller" />
                </RadioButton.Group>
                
                <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
                    <Text style={styles.imagePickerText}>Chọn ảnh đại diện</Text>
                </TouchableOpacity>
                {avatar && <Image source={{ uri: avatar.uri }} style={styles.avatar} />}
                
                <Button mode="contained" onPress={register} loading={loading} style={styles.button}>
                    Đăng ký
                </Button>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default Register;
