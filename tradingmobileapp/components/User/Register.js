import { Image, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, Alert } from "react-native";
import { Button, RadioButton, TextInput } from "react-native-paper";
import Styles from "../../styles/Styles";
import * as ImagePicker from 'expo-image-picker';
import { useState } from "react";
import APIs, { endpoints } from "../../configs/APIs";
import { useNavigation } from "@react-navigation/native";

const Register = () => {
    const [user, setUser] = useState({
        "username": "",
        "password": "",
        "email": "",
        "role": "Buyer",
        "first_name": "",
        "last_name": "",
        "confirm": "",
    });
    const [avatar, setAvatar] = useState(null);
    const [loading, setLoading] = useState(false);
    const nav = useNavigation();

    const updateUser = (value, field) => {
        setUser({ ...user, [field]: value });
    };

    const pickImage = async () => {
        let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert("Bạn cần cấp quyền để chọn ảnh đại diện.");
        } else {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });
            if (!result.canceled) setAvatar(result.assets[0]);
        }
    };

    const validateInput = () => {
        if (!user.username || !user.password || !user.email || !user.first_name || !user.last_name) {
            Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin.");
            return false;
        }
        if (user.password !== user.confirm) {
            Alert.alert("Lỗi", "Mật khẩu và xác nhận mật khẩu không khớp.");
            return false;
        }
        if (!avatar) {
            Alert.alert("Lỗi", "Vui lòng chọn ảnh đại diện.");
            return false;
        }
        return true;
    };

    const register = async () => {
        if (!validateInput()) return;
        setLoading(true);
        try {
            const form = new FormData();

            for (let key in user) {
                if (key !== 'confirm') form.append(key, user[key]);
            }

            form.append('avatar', {
                uri: avatar.uri,
                name: avatar.fileName || 'avatar.jpg',
                type: avatar.mimeType || 'image/jpeg',
            });

            await APIs.post(endpoints['register'], form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            Alert.alert("Thành công", "Đăng ký thành công. Vui lòng đăng nhập.");
            nav.navigate("Login");
        } catch (error) {
            console.error(error);
            Alert.alert("Lỗi", "Đã xảy ra lỗi trong quá trình đăng ký.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView>
                <TextInput
                    style={Styles.margin}
                    label="Tên"
                    value={user.first_name}
                    onChangeText={(t) => updateUser(t, 'first_name')}
                />
                <TextInput
                    style={Styles.margin}
                    label="Họ và tên lót"
                    value={user.last_name}
                    onChangeText={(t) => updateUser(t, 'last_name')}
                />
                <TextInput
                    style={Styles.margin}
                    label="Tên đăng nhập"
                    value={user.username}
                    onChangeText={(t) => updateUser(t, 'username')}
                />
                <TextInput
                    style={Styles.margin}
                    label="Email"
                    keyboardType="email-address"
                    value={user.email}
                    onChangeText={(t) => updateUser(t, 'email')}
                />
                <TextInput
                    style={Styles.margin}
                    label="Mật khẩu"
                    secureTextEntry
                    value={user.password}
                    onChangeText={(t) => updateUser(t, 'password')}
                />
                <TextInput
                    style={Styles.margin}
                    label="Xác nhận mật khẩu"
                    secureTextEntry
                    value={user.confirm}
                    onChangeText={(t) => updateUser(t, 'confirm')}
                />

                <Text style={Styles.margin}>Chọn vai trò:</Text>
                <RadioButton.Group
                    onValueChange={(value) => updateUser(value, 'role')}
                    value={user.role}
                >
                    <RadioButton.Item label="Người dùng cá nhân" value="Buyer" />
                    <RadioButton.Item label="Doanh nghiệp" value="Seller" />
                </RadioButton.Group>

                <TouchableOpacity onPress={pickImage} style={Styles.margin}>
                    <Text>Chọn ảnh đại diện</Text>
                </TouchableOpacity>

                {avatar && <Image source={{ uri: avatar.uri }} style={{ width: 100, height: 100, alignSelf: 'center' }} />}

                <Button
                    onPress={register}
                    loading={loading}
                    mode="contained"
                    style={Styles.margin}
                >
                    Đăng ký
                </Button>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default Register;
