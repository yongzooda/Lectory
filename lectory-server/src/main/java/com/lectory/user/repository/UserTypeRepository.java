package com.lectory.user.repository;

import com.lectory.common.domain.user.UserType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserTypeRepository extends JpaRepository<UserType, String> {
}