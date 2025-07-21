package com.lectory.files;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.ResourceRegionHttpMessageConverter;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    /**
     * ResourceRegion 타입(206 Partial Content) 응답을 처리할 컨버터 등록
     */
    @Bean
    public ResourceRegionHttpMessageConverter resourceRegionHttpMessageConverter() {
        return new ResourceRegionHttpMessageConverter();
    }
}
