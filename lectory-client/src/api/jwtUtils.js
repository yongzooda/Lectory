import { jwtDecode } from "jwt-decode";

class JwtUtils {
  static getId(token) {
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
      return decoded.userId;
    } catch (e) {
      console.error("JWT 디코딩 오류:", e);
      return null;
    }
  }
}

export default JwtUtils;
