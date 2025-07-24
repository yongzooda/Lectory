// src/main/java/com/lectory/files/FileServeController.java
package com.lectory.files;

import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.ResourceRegion;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/files")
public class FileServeController {

    private final FileStorageService storage;

    // 1) 전체 파일 다운로드(200) — Range 헤더가 없을 때
    @GetMapping("/{id}")
    public ResponseEntity<Resource> full(
            @PathVariable String id
    ) throws Exception {
        GridFsResource res = storage.get(id);
        MediaType mt = detectMediaType(res);
        long len = res.contentLength();

        return ResponseEntity.ok()
                .contentType(mt)
                .contentLength(len)
                .header(HttpHeaders.ACCEPT_RANGES, "bytes")
                .body(res);
    }

    // 2) 부분 스트리밍(206) — Range 헤더가 있을 때
    @GetMapping(value = "/{id}", headers = HttpHeaders.RANGE)
    public ResponseEntity<ResourceRegion> partial(
            @PathVariable String id,
            @RequestHeader(HttpHeaders.RANGE) String rangeHeader
    ) throws Exception {
        GridFsResource res = storage.get(id);
        MediaType mt = detectMediaType(res);
        long len = res.contentLength();

        HttpRange r = HttpRange.parseRanges(rangeHeader).get(0);
        long start = r.getRangeStart(len);
        long chunk = Math.min(1 * 1024 * 1024, len - start);
        ResourceRegion region = new ResourceRegion(res, start, chunk);

        return ResponseEntity.status(HttpStatus.PARTIAL_CONTENT)
                .contentType(mt)
                .header(HttpHeaders.ACCEPT_RANGES, "bytes")
                .body(region);
    }

    /** .mp4 확장자면 강제 video/mp4, 아니면 MediaTypeFactory 이용 */
    private MediaType detectMediaType(GridFsResource res) {
        MediaType mt = MediaTypeFactory.getMediaType(res)
                .orElse(MediaType.APPLICATION_OCTET_STREAM);
        String fn = res.getFilename();
        if (fn != null && fn.toLowerCase().endsWith(".mp4")) {
            mt = MediaType.valueOf("video/mp4");
        }
        return mt;
    }
}
