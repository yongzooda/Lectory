package com.lectory;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class LectoryApplication {

	public static void main(String[] args) {
		SpringApplication.run(LectoryApplication.class, args);
	}

}
