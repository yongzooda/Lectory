// File: src/main/java/com/lectory/contentlibrary/controller/TagController.java
package com.lectory.contentlibrary.controller;

import com.lectory.common.domain.Tag;
import com.lectory.common.repository.TagRepository;   // ← 이미 존재하는 리포지터리
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 태그 조회 전용 컨트롤러
 *
 * • GET /api/tags            → 전체 태그 이름 배열
 * • GET /api/tags?q=Re       → 접두어가 "Re"인 태그만 (자동완성용, 선택)
 */
@RestController
@RequestMapping("/api/tags")
@RequiredArgsConstructor
public class TagController {

    private final TagRepository tagRepo;

    /**
     * q 파라미터가 있으면 prefix 검색, 없으면 전체 목록 반환
     */
    @GetMapping
    public List<String> listTags(@RequestParam(required = false) String q) {

        return (q != null && !q.isBlank()
                ? tagRepo.findByNameStartingWith(q)
                : tagRepo.findAll())
                .stream()
                .map(Tag::getName)   // Tag 엔티티 → 이름(String)
                .toList();           // Java 16+ (8이라면 Collectors.toList())
    }
}
