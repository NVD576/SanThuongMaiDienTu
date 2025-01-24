import axios from "axios";

const BASE_URL = 'http://192.168.1.14:8000/';

export const endpoints = {
    'stores':'/stores/',
    'products':'/products/',
    'categorys':'/categorys/'
}

export default axios.create({
    baseURL: BASE_URL
});
