package com.lectory.files;

import lombok.RequiredArgsConstructor;
import org.springframework.core.io.*;
import org.springframework.core.io.support.ResourceRegion;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class FileServeController {

    private final FileStorageService storage;

    @GetMapping("/api/files/{id}")
    public ResponseEntity<?> serve(@PathVariable String id,
                                   @RequestHeader(value = "Range", required = false) String range)
            throws Exception {

        GridFsResource res = storage.get(id);
        long len = res.contentLength();
        MediaType mt = MediaTypeFactory.getMediaType(res).orElse(MediaType.APPLICATION_OCTET_STREAM);

        // 동영상 Range 처리
        if (range != null && mt.getType().equals("video")) {
            HttpRange r = HttpRange.parseRanges(range).get(0);
            long start = r.getRangeStart(len);
            long chunk = Math.min(1 * 1024 * 1024, len - start);
            ResourceRegion region = new ResourceRegion(res, start, chunk);
            return ResponseEntity.status(HttpStatus.PARTIAL_CONTENT)
                    .contentType(mt)
                    .body(region);
        }
        // 이미지·ZIP·PDF 등
        return ResponseEntity.ok()
                .contentType(mt)
                .contentLength(len)
                .body(res);
    }
}
