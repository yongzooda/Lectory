// src/api/expertApi.js
import api from './axiosInstance';

/**
 * 1) 내 강의실 목록
 */
export const listMyLectures = ({ page, size, sort }) =>
  api.get('/library/expert', { params: { page, size, sort } });

/**
 * 2) 내 강의실 검색 (제목·태그)
 */
export const searchMyLectures = ({ keyword, tags, page, size, sort }) =>
  api.get('/library/expert/search', {
    params: { keyword, tags, page, size, sort },
  });

/**
 * 3) 강의실 상세 (전문가 뷰)
 */
export const getLectureDetail = (lectureRoomId) =>
  api.get(`/library/expert/${lectureRoomId}`);

/**
 * 4) 강의실 신규 등록
 */
export const createLecture = (payload) =>
  api.post('/library/expert', payload);

/**
 * 5) 강의실 수정
 */
export const updateLecture = ({ lectureRoomId, ...rest }) =>
  api.put(`/library/expert/${lectureRoomId}`, rest);

/**
 * 6) 강의실 삭제
 */
export const deleteLecture = (lectureRoomId) =>
  api.delete(`/library/expert/${lectureRoomId}`);

/**
 * 7) 챕터 생성
 */
export const createChapter = (payload) =>
  api.post('/library/expert/chapters', payload);

/**
 * 8) 챕터 수정
 */
export const updateChapter = ({ chapterId, ...rest }) =>
  api.put(`/library/expert/chapters/${chapterId}`, rest);

/**
 * 9) 챕터 삭제
 */
export const deleteChapter = (chapterId) =>
  api.delete(`/library/expert/chapters/${chapterId}`);

/**
 * 10) 태그 풀 조회
 */
export const fetchAllTags = () =>
  api.get('/tags');
