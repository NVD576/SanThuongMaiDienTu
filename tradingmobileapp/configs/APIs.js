import axios from "axios";

const BASE_URL = 'http://127.0.0.1:8000/';

export const endpoints = {
    'stores':'stores/',
    'products':'products/'
}

export default axios.create({
    baseURL: BASE_URL
});