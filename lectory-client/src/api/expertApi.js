// src/api/expertApi.js
import api from './axiosInstance';

/**
 * @typedef {Object} Chapter
 * @property {number} chapterId
 * @property {string} chapterName
 * @property {string} expectedTime
 * @property {number} orderNum
 * @property {string|null} videoUrl
 * @property {string[]} tags
 *
 * @typedef {Object} LectureRoomSummary
 * @property {number} lectureRoomId
 * @property {string} thumbnail
 * @property {string} title
 * @property {string} expertName
 * @property {number} enrollmentCount
 * @property {boolean} isPaid
 * @property {boolean} isEnrolled
 * @property {boolean} canEnroll
 * @property {string[]} tags
 *
 * @typedef {Object} Comment
 * @property {number} commentId
 * @property {string} author
 * @property {string} content
 * @property {string} createdAt
 *
 * @typedef {Object} LectureDetail
 * @property {number} lectureRoomId
 * @property {string} title
 * @property {string} coverImageUrl
 * @property {string} fileUrl
 * @property {string} description
 * @property {string} expertName
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {number} enrollmentCount
 * @property {string[]} tags
 * @property {Chapter[]} chapters
 * @property {Comment[]} lectureComments
 * @property {boolean} isEnrolled
 * @property {boolean} isPaid
 * @property {boolean} canEnroll
 */

/**
 * 1) 내 강의실 목록
 * @param {{ expertId: number, page: number, size: number, sort: string }} args
 * @returns {Promise<import('axios').AxiosResponse<{ content: LectureRoomSummary[] }>>}
 */
export const listMyLectures = ({ expertId, page, size, sort }) =>
  api.get('/library/expert', { params: { expertId, page, size, sort } });

/**
 * 2) 내 강의실 검색 (제목·태그)
 * @param {{ expertId: number, keyword?: string, tags?: string[], page: number, size: number, sort: string }} args
 * @returns {Promise<import('axios').AxiosResponse<{ content: LectureRoomSummary[] }>>}
 */
export const searchMyLectures = ({ expertId, keyword, tags, page, size, sort }) =>
  api.get('/library/expert/search', {
    params: { expertId, keyword, tags, page, size, sort },
  });

/**
 * 3) 강의실 상세 (전문가 뷰)
 * @param {{ lectureRoomId: number, expertId: number }} args
 * @returns {Promise<import('axios').AxiosResponse<LectureDetail>>}
 */
export const getLectureDetail = ({ lectureRoomId, expertId }) =>
  api.get(`/library/expert/${lectureRoomId}`, { params: { expertId } });

/**
 * 4) 강의실 신규 등록
 * @param {Object} payload
 * @returns {Promise<import('axios').AxiosResponse<{ lectureRoomId: number }>>}
 */
export const createLecture = (payload) =>
  api.post('/library/expert', payload);

/**
 * 5) 강의실 수정
 * @param {{ lectureRoomId: number, expertId: number, [key: string]: any }} args
 * @returns {Promise<import('axios').AxiosResponse<{ message: string }>>}
 */
export const updateLecture = ({ lectureRoomId, expertId, ...rest }) =>
  api.put(`/library/expert/${lectureRoomId}`, { expertId, ...rest });

/**
 * 6) 강의실 삭제
 * @param {{ lectureRoomId: number, expertId: number }} args
 * @returns {Promise<import('axios').AxiosResponse<{ message: string }>>}
 */
export const deleteLecture = ({ lectureRoomId, expertId }) =>
  api.delete(`/library/expert/${lectureRoomId}`, { params: { expertId } });

/**
 * 7) 챕터 생성
 * @param {Object} payload
 * @returns {Promise<import('axios').AxiosResponse<{ chapterId: number }>>}
 */
export const createChapter = (payload) =>
  api.post('/library/expert/chapters', payload);

/**
 * 8) 챕터 수정
 * @param {{ chapterId: number, expertId: number, [key: string]: any }} args
 * @returns {Promise<import('axios').AxiosResponse<{ message: string }>>}
 */
export const updateChapter = ({ chapterId, expertId, ...rest }) =>
  api.put(`/library/expert/chapters/${chapterId}`, { expertId, ...rest });

/**
 * 9) 챕터 삭제
 * @param {{ chapterId: number, expertId: number }} args
 * @returns {Promise<import('axios').AxiosResponse<{ message: string }>>}
 */
export const deleteChapter = ({ chapterId, expertId }) =>
  api.delete(`/library/expert/chapters/${chapterId}`, { params: { expertId } });

/**
 * 10) 태그 풀 조회
 * @returns {Promise<import('axios').AxiosResponse<string[]>>}
 */
export const fetchAllTags = () =>
  api.get('/tags');
