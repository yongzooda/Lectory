// PageDto.java
package com.lectory.lecture.dto;

import lombok.Builder;
import lombok.Getter;
import org.springframework.data.domain.Page;

import java.util.List;

/**
 * 페이징 응답을 공통으로 감싸는 DTO
 */
@Getter
@Builder
public class PageDto<T> {

    /** 실제 데이터 리스트 */
    private final List<T> content;

    /** 현재 페이지 번호 (0 기반) */
    private final int pageNumber;

    /** 페이지 크기 */
    private final int pageSize;

    /** 전체 페이지 수 */
    private final int totalPages;

    /** 전체 요소 개수 */
    private final long totalElements;

    /** 결과 비어있는지 여부 */
    private final boolean empty;

    /** 추가 메시지 (예: “검색 결과가 없습니다.”) */
    private final String message;

    /**
     * Spring Data Page<T>를 PageDto<T>로 변환해주는 팩토리 메서드
     */
    public static <T> PageDto<T> of(Page<T> page) {
        return PageDto.<T>builder()
                .content(page.getContent())
                .pageNumber(page.getNumber())
                .pageSize(page.getSize())
                .totalPages(page.getTotalPages())
                .totalElements(page.getTotalElements())
                .empty(page.isEmpty())
                .message(page.isEmpty() ? "검색 결과가 없습니다." : "")
                .build();
    }
}
