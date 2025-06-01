import axios from 'axios';

const API_URL = 'http://localhost:8080'; // URL сервиса регистрации/авторизации


interface SignupData {
    nickname: string;
    email: string;
    password: string;
}
export async function signUp({nickname, email, password}:SignupData) {
    const response = await axios.post(`${API_URL}/auth/register`, {
        nickname,
        email,
        password,
    });
    return response.data; // { id, nickname }
}

interface LoginData {
    nickname: string;
    password: string;
}
export async function login({nickname, password}:LoginData) {
    const response = await axios.post(`${API_URL}/auth/login`, {
        nickname,
        password,
    });
    return response.data; // { access_token, refresh_token }
}
