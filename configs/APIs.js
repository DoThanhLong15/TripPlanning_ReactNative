import axios from "axios";

const BASE_URL = 'https://longd8833.pythonanywhere.com/';

export const endpoints = {
    'tripplans': '/tripplans/',
    'register': '/users/',
    'login': '/oauth/token/',
    'current-user': '/users/current-user/',
    'create-tripplan': '/users/create-tripplan/',
};

export const authAPI = (token) => {
    return axios.create({
        baseURL: BASE_URL,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
}

export default axios.create({
    baseURL: BASE_URL
});