// src/components/detail/ChapterList.jsx
import styles from '../../assets/css/contentLibrary.module.css';
import React from 'react';

const ChapterList = ({ chapters = [], isEnrolled = false, onSelect }) => {
  if (!chapters.length) {
    return <p className="text-center text-gray-500">등록된 챕터가 없습니다.</p>;
  }

  const isYouTube = (url) =>
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)/.test(url);

  const toYouTubeEmbed = (url) => {
    const idMatch = url.match(/(?:v=|\.be\/)([^&]+)/);
    return idMatch ? `https://www.youtube.com/embed/${idMatch[1]}` : url;
  };

  return (
    <ul className="space-y-4">
      {chapters
        .slice()
        .sort((a, b) => (a.orderNum ?? 0) - (b.orderNum ?? 0))
        .map((c, i) => {
          const raw = c.videoUrl;
          if (!raw) return null;

          // 1) 내부 파일: /files/xxx 또는 /api/files/xxx
          // 2) 외부 URL: http(s)://…
          let src;
          if (raw.startsWith('/')) {
            // `/files/...` 또는 `/api/files/...`
            src = raw.startsWith('/api/') ? raw : `/api${raw}`;
          } else {
            // 외부 링크
            src = raw;
          }

          const isYT = isYouTube(src);

          return (
            <li
              key={c.chapterId ?? i}
              className="p-4 border rounded-lg hover:shadow transition cursor-pointer"
              onClick={() => onSelect?.(c)}
            >
              {/* 헤더 */}
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-semibold">
                  {c.orderNum != null ? `${c.orderNum}. ` : ''}
                  {c.chapterName}
                </h3>
                {c.expectedTime && (
                  <span className="text-sm text-gray-500">{c.expectedTime}</span>
                )}
              </div>

              {/* 태그 */}
              <div className="flex flex-wrap gap-2 mb-2">
                {c.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-gray-200 px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>

              {/* 플레이어 */}
              {isEnrolled && (
                isYT ? (
                  <div className="aspect-video w-full rounded shadow-inner overflow-hidden mt-2">
                    <iframe
                      src={toYouTubeEmbed(src)}
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
                    <source src={src} type="video/mp4" />
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
