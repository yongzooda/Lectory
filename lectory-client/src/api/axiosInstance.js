// src/api/axiosInstance.js
import axios from 'axios';
import qs from 'qs';

/** ------------------------------------------------------------------
 *  공통 axios 인스턴스
 *    · baseURL : /api
 *    · JSON 자동 파싱
 *    · 요청 시 인증 토큰(예: JWT) 헤더 부착(선택)
 *    · 에러 로깅 & 공통 오류 메시지 처리
 * ----------------------------------------------------------------- */
const api = axios.create({
  baseURL: '/api',
  withCredentials: true,       // 쿠키 필요 시
  headers: {
    'Content-Type': 'application/json',
  },
    /* 배열 파라미터 직렬화 방식:
     tags=Java&tags=Spring (repeat 방식) */
      paramsSerializer: params =>
      qs.stringify(params, { arrayFormat: 'repeat' }),
});

/* ----- 요청 인터셉터 : 토큰 주입 (옵션) ---------------------------- */
api.interceptors.request.use((config) => {
  // 예) localStorage에 저장한 JWT → Authorization 헤더
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

/* ----- 응답 인터셉터 : 공통 에러 처리 ----------------------------- */
api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('[API ERROR]', err.response?.data || err.message);
    // 필요하면 toast/alert 로 사용자 알림
    return Promise.reject(err);
  }
);

export default api;
