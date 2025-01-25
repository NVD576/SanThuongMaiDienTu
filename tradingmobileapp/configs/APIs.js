import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const BASE_URL = 'http://192.168.1.3:8000/';

export const endpoints = {
    'stores':'/stores/',
    'products':'/products/',
    'categorys':'/categorys/',
    'login':'/o/token/',
    'current-user':'/users/current-user/',
    'register': '/users/'
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
