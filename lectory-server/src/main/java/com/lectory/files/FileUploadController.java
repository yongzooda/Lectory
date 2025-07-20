package com.lectory.files;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileUploadController {

    private final FileStorageService storage;

    @PostMapping("/upload")
    //@RequestPart MultipartFile file
    // -> Content-Type: multipart/form-data 요청 본문에서 part 이름이 file 인 파일을 잡아줌
    public ResponseEntity<?> upload(@RequestPart MultipartFile file) throws Exception {
        String id  = storage.store(file.getInputStream(),
                file.getOriginalFilename(),
                file.getContentType());
        String url = "/files/" + id;      // 이 값을 MySQL URL 컬럼에 그대로 저장
        return ResponseEntity.ok(java.util.Map.of("url", url));
    }
}
