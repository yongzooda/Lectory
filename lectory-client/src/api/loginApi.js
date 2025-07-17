import api from './axiosInstance';
import {useNavigate} from "react-router-dom";

export const login = async ({ email, password }) => {
    try {
        const response = await api.post('/auth/login', { email, password });

        const accessToken = response.data.accessToken;
        console.log('로그인 성공, 토큰:', accessToken);

        localStorage.setItem('accessToken', accessToken);
        return accessToken;


    } catch (error) {
        if (error.response) {
            console.error('로그인 실패:', error.response.data);
        } else {
            console.error('로그인 오류:', error.message);
        }
        throw error;
    }
};