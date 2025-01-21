import axios from "axios";

const BASE_URL = '';

export const endpoints = {
    'stores':'/stores',
    'products':'/products'
}

export default axios.create({
    baseURL: BASE_URL
});