import api from './axiosInstance';

export const expertSignup = async ({
  email,
  password,
  passwordConfirm,
  nickname,
  portfolioFileUrl,
  profileImageUrl,
}) => {
  try {
    const response = await api.post('/experts/signup', {
      email,
      password,
      passwordConfirm,
      nickname,
      portfolioFileUrl,
      profileImageUrl,
    });

    console.log('전문가 회원가입 성공:', response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('전문가 회원가입 실패:', error.response.data);
    } else {
      console.error('전문가 회원가입 오류:', error.message);
    }
    throw error;
  }
};