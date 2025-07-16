import axios from 'axios';

// 1) 내 강의 목록 조회
export function listMyLectures({ expertId, page, size, sort }) {
  return axios.get('/library/expert', {
    params: { expertId, page, size, sort }
  });
}

// 2) 내 강의 검색 (제목·태그)
export function searchMyLectures({ expertId, keyword, tags, page, size, sort }) {
  return axios.get('/library/expert/search', {
    params: { expertId, keyword, tags, page, size, sort }
  });
}

// 3) 강의실 상세 조회
export function getLectureDetail({ lectureRoomId, expertId }) {
  return axios.get(`/library/expert/${lectureRoomId}`, {
    params: { expertId }
  });
}

// 4) 강의실 등록
export function createLecture({ expertId, thumbnail, title, description, fileUrl, isPaid, tags }) {
  return axios.post('/library/expert', {
    expertId,
    thumbnail,
    title,
    description,
    fileUrl,
    isPaid,
    tags
  });
}

// 5) 강의실 수정
export function updateLecture({ lectureRoomId, expertId, thumbnail, title, description, fileUrl, isPaid }) {
  return axios.put(`/library/expert/${lectureRoomId}`, {
    expertId,
    thumbnail,
    title,
    description,
    fileUrl,
    isPaid
  });
}

// 6) 강의실 삭제
export function deleteLecture({ lectureRoomId, expertId }) {
  return axios.delete(`/library/expert/${lectureRoomId}`, {
    params: { expertId }
  });
}

// 7) 챕터 등록
export function createChapter({ lectureRoomId, expertId, chapterName, expectedTime, orderNum, videoUrl }) {
  return axios.post('/library/expert/chapters', {
    lectureRoomId,
    expertId,
    chapterName,
    expectedTime,
    orderNum,
    videoUrl
  });
}

// 8) 챕터 수정
export function updateChapter({ chapterId, expertId, chapterName, expectedTime, orderNum, videoUrl }) {
  return axios.put(`/library/expert/chapters/${chapterId}`, {
    expertId,
    chapterName,
    expectedTime,
    orderNum,
    videoUrl
  });
}

// 9) 챕터 삭제
export function deleteChapter({ chapterId, expertId }) {
  return axios.delete(`/library/expert/chapters/${chapterId}`, {
    params: { expertId }
  });
}
