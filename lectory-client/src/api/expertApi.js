// src/api/expertApi.js
import api from './axiosInstance';

/* ---------------- 콘텐츠 라이브러리 (전문가) -------------------- */

/** 1) 내 강의실 목록 */
export const listMyLectures = ({ expertId, page, size, sort }) =>
  api.get('/library/expert', { params: { expertId, page, size, sort } });

/** 2) 내 강의실 검색 (제목·태그) */
export const searchMyLectures = ({ expertId, keyword, tags, page, size, sort }) =>
  api.get('/library/expert/search', {
    params: { expertId, keyword, tags, page, size, sort },
  });

/** 3) 강의실 상세 (전문가 뷰) */
export const getLectureDetail = ({ lectureRoomId, expertId }) =>
  api.get(`/library/expert/${lectureRoomId}`, { params: { expertId } });

/** 4) 강의실 신규 등록 */
export const createLecture = (payload) =>
  api.post('/library/expert', payload);  // payload: { expertId, title, ... }

/** 5) 강의실 수정 */
export const updateLecture = ({ lectureRoomId, expertId, ...rest }) =>
  api.put(`/library/expert/${lectureRoomId}`, { expertId, ...rest });

/** 6) 강의실 삭제 */
export const deleteLecture = ({ lectureRoomId, expertId }) =>
  api.delete(`/library/expert/${lectureRoomId}`, { params: { expertId } });

/* ---- 챕터 CRUD (전문가) --------------------------------------- */

/** 7) 챕터 생성 */
export const createChapter = (payload) =>
  api.post('/library/expert/chapters', payload); // { lectureRoomId, expertId, ... }

/** 8) 챕터 수정 */
export const updateChapter = ({ chapterId, expertId, ...rest }) =>
  api.put(`/library/expert/chapters/${chapterId}`, { expertId, ...rest });

/** 9) 챕터 삭제 */
export const deleteChapter = ({ chapterId, expertId }) =>
  api.delete(`/library/expert/chapters/${chapterId}`, { params: { expertId } });

/* ---- 공통 태그 풀 --------------------------------------------- */
export const fetchAllTags = () => api.get('/tags');
