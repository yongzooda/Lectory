// src/api/studentApi.js
import api from './axiosInstance';

/* ---------------- 콘텐츠 라이브러리 (수강자) -------------------- */

/** 1) 전체 / 인기·최신순 목록 */
export const listLectureRooms = ({ memberId, page, size, sort }) =>
  api.get('/library', { params: { memberId, page, size, sort } });

/** 2) 제목·태그 검색 */
export const searchLectureRooms = ({ memberId, search, tags, page, size, sort }) =>
  api.get('/library/search', {
    params: { memberId, search, tags, page, size, sort },
  });

/** 3) 강의실 상세 조회 */
export const getLectureDetail = ({ lectureRoomId, memberId }) =>
  api.get(`/library/${lectureRoomId}`, { params: { memberId } });

/** 4) 수강 신청 (무료·유료 구분은 백엔드에서) */
export const enroll = ({ lectureRoomId, memberId }) =>
  api.post(`/library/${lectureRoomId}/enroll`, { memberId });

/** 5) 수강평(댓글) 작성 */
export const postComment = ({ lectureRoomId, memberId, content }) =>
  api.post(`/library/${lectureRoomId}/comments`, { memberId, content });

/** 6) 태그 풀 (필터 바)  */
/*  전체 목록:       GET /api/tags
    접두어 검색(q): GET /api/tags?q=Re  → ["React", …]   */
export const fetchAllTags = (q = "") =>
  api.get("/tags", { params: q ? { q } : {} });

