import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const BASE_URL = 'http://192.168.1.13:8000/';

export const endpoints = {
    'stores':'/stores/',
    'products':'/products/',
    'product-details': productId => `/products/${productId}/`,
    'categories':'/categories/',
    'login':'/o/token/',
    'current-user':'/users/current-user/',
    'register': '/users/',
    'reviews':'/reviews/'
}

export const authApis = async () => {
    const token = await AsyncStorage.getItem('token');
    return axios.create({
        baseURL: BASE_URL,
        headers:{
            'Authorization':`Bearer ${token}`
        }
    })

}

export default axios.create({
    baseURL: BASE_URL
});
