// src/components/detail/ChapterList.jsx
import React from 'react';

/**
 * 강의실 상세 페이지 – 챕터 목록
 *
 * props
 *  • chapters    : Array<{
 *        chapterId: number,
 *        chapterName: string,
 *        expectedTime: string,
 *        orderNum: number,
 *        videoUrl?: string | null,
 *        tags: string[]
 *    }>
 *  • isEnrolled  : boolean — 수강 여부 (true면 videoUrl 노출)
 *  • onSelect    : (chapter) => void (선택)
 */
const ChapterList = ({ chapters = [], isEnrolled = false, onSelect }) => {
  if (chapters.length === 0) {
    return <p className="text-center text-gray-500">등록된 챕터가 없습니다.</p>;
  }

  // YouTube인지 검사
  const isYouTube = (url) => /(?:youtube\.com\/watch\?v=|youtu\.be\/)/.test(url);
  // YouTube 임베드 URL로 바꿔줌
  const toYouTubeEmbed = (url) => {
    const idMatch = url.match(/(?:v=|\.be\/)([^&]+)/);
    return idMatch ? `https://www.youtube.com/embed/${idMatch[1]}` : url;
  };
  // MIME 타입 결정 (video 태그용)
  const getMime = (url) => {
    if (/\.mp4($|\?)/i.test(url)) return 'video/mp4';
    if (/\.webm($|\?)/i.test(url)) return 'video/webm';
    if (/\.ogg($|\?)/i.test(url)) return 'video/ogg';
    return 'application/octet-stream';
  };

  return (
    <ul className="space-y-4">
      {chapters
        .slice()
        .sort((a, b) => (a.orderNum ?? 0) - (b.orderNum ?? 0))
        .map((c, i) => {
          const raw = c.videoUrl;  // "/files/…" or "https://…"
          if (!raw) return null;

          let isYT = false;
          let src = null;

          if (/^https?:\/\//.test(raw)) {
            // 외부
            if (isYouTube(raw)) {
              isYT = true;
              src = toYouTubeEmbed(raw);
            } else {
              // MP4/WebM 등의 직접 링크
              src = raw;
            }
          } else if (raw.startsWith('/files/')) {
            // 내부 업로드
            src = `/api${raw}`;
          } else {
            // id만 들어온 경우
            src = `/api/files/${raw}`;
          }

          return (
            <li
              key={c.chapterId ?? i}
              className="p-4 border rounded-lg hover:shadow transition cursor-pointer"
              onClick={() => onSelect?.(c)}
            >
              {/* 헤더 */}
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-semibold">
                  {c.orderNum != null && `${c.orderNum}. `}{c.chapterName}
                </h3>
                {c.expectedTime && (
                  <span className="text-sm text-gray-500">{c.expectedTime}</span>
                )}
              </div>
              {/* 태그 */}
              <div className="flex flex-wrap gap-2 mb-2">
                {c.tags.map(tag => (
                  <span key={tag} className="text-xs bg-gray-200 px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
              {/* 플레이어 */}
              {isEnrolled && src && (
                isYT ? (
                  <div className="aspect-video w-full rounded shadow-inner overflow-hidden mt-2">
                    <iframe
                      src={src}
                      title={c.chapterName}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                ) : (
                  <video
                    controls
                    preload="metadata"
                    className="w-full rounded shadow-inner mt-2"
                  >
                    <source src={src} type={getMime(src)} />
                    이 브라우저는 video 태그를 지원하지 않습니다.
                  </video>
                )
              )}
            </li>
          );
        })}
    </ul>
  );
};

export default ChapterList;
