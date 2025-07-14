DROP TABLE USER;
DROP TABLE EXPERT;
DROP TABLE POST;
DROP TABLE POST_TAG;
DROP TABLE COMMENT;
DROP TABLE REPORT;
DROP TABLE `LIKE`;
DROP TABLE TAG;
DROP TABLE LECTURE_ROOM;
DROP TABLE LECTURE;
DROP TABLE LECTURE_TAG;
DROP TABLE EXPERT_TAG;
DROP TABLE MEMBERSHIP;
DROP TABLE LECTURE_COMMENT;
DROP TABLE PAY_HISTORY;
DROP TABLE REGULAR_PAY;



-- 회원 테이블
CREATE TABLE user (
    user_id BIGINT AUTO_INCREMENT,
    email VARCHAR(100),
    password VARCHAR(255) NOT NULL,
    nickname VARCHAR(50) NOT NULL,
    user_type ENUM('FREE', 'PAID', 'EXPERT', 'ADMIN'),
    is_deleted BOOLEAN,
    created_at DATETIME,
    deleted_at DATETIME,
    subcription_start_date DATETIME,
    subcription_end_date DATETIME,
    PRIMARY KEY (user_id)
);

-- 전문가 테이블
CREATE TABLE expert (
    expert_id BIGINT AUTO_INCREMENT,
    user_id BIGINT,
    portfolio_file_url VARCHAR(255),
    approval_status ENUM('PENDING', 'APPROVED', 'REJECTED'),
    profile_image_url VARCHAR(255),
    PRIMARY KEY (expert_id)
);

-- 게시글 테이블
CREATE TABLE post (
    post_id BIGINT AUTO_INCREMENT,
    user_id BIGINT,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    only_expert BOOLEAN,
    is_resolved BOOLEAN,
    subscriber_type ENUM('FREE', 'PAID'),
    like_count INT UNSIGNED,
    created_at DATETIME,
    updated_at DATETIME,
    PRIMARY KEY (post_id)
);

-- 게시글-태그 중간 테이블
CREATE TABLE post_tag (
    post_id BIGINT,
    tag_id BIGINT,
    PRIMARY KEY (post_id, tag_id)
);

-- 댓글 테이블
CREATE TABLE comment (
    comment_id BIGINT AUTO_INCREMENT,
    post_id BIGINT,
    user_id BIGINT,
    parent_id BIGINT,
    content TEXT,
    like_count INT UNSIGNED,
    created_at DATETIME,
    updated_at DATETIME,
    is_accepted BOOLEAN,
    is_deleted BOOLEAN,
    PRIMARY KEY (comment_id)
);

-- 신고 테이블
CREATE TABLE report (
    report_id BIGINT AUTO_INCREMENT,
    target ENUM('POST', 'COMMENT'),
    target_id BIGINT,
    user_id BIGINT,
    content TEXT,
    created_at DATETIME,
    status ENUM('PENDING', 'PROCESSED', 'REJECTED'),
    PRIMARY KEY (report_id)
);

-- 좋아요 테이블
CREATE TABLE `like` (
    like_id BIGINT AUTO_INCREMENT,
    target ENUM('POST', 'COMMENT'),
    target_id BIGINT,
    user_id BIGINT,
    PRIMARY KEY (like_id)
);

-- 태그 테이블
CREATE TABLE tag (
    tag_id BIGINT AUTO_INCREMENT,
    name VARCHAR(100),
    PRIMARY KEY (tag_id)
);

-- 강의실 테이블
CREATE TABLE lecture_room (
    lecture_room_id BIGINT AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    cover_image_url VARCHAR(255),
    file_url VARCHAR(255),
    expert_id BIGINT,
    is_paid BOOLEAN,
    created_at DATETIME,
    updated_at DATETIME,
    PRIMARY KEY (lecture_room_id)
);

-- 강의(챕터) 테이블
CREATE TABLE lecture (
    lecture_id BIGINT AUTO_INCREMENT,
    lecture_room_id BIGINT,
    chapter_name VARCHAR(255) NOT NULL,
    expected_time VARCHAR(50),
    video_url VARCHAR(255),
    order_num INT,
    created_at DATETIME,
    updated_at DATETIME,
    PRIMARY KEY (lecture_id)
);

-- 강의-태그 매핑
CREATE TABLE lecture_tag (
    lecture_id BIGINT,
    tag_id BIGINT,
    PRIMARY KEY (lecture_id, tag_id)
);

-- 전문가-태그 매핑
CREATE TABLE expert_tag (
    expert_id BIGINT,
    tag_id BIGINT,
    PRIMARY KEY (expert_id, tag_id)
);

-- 수강권
CREATE TABLE membership (
    membership_id BIGINT AUTO_INCREMENT,
    member_id BIGINT,
    lecture_room_id BIGINT,
    enrolled_at DATETIME,
    PRIMARY KEY (membership_id)
);

-- 후기 댓글
CREATE TABLE lecture_comment (
    lecture_comment_id BIGINT AUTO_INCREMENT,
    member_id BIGINT,
    lecture_room_id BIGINT,
    content TEXT,
    created_at DATETIME,
    PRIMARY KEY (lecture_comment_id)
);

-- 결제 내역
CREATE TABLE pay_history (
    pay_history_id BIGINT AUTO_INCREMENT,
    member_id BIGINT,
    paid_at DATETIME,
    PRIMARY KEY (pay_history_id)
);

-- 정기 결제
CREATE TABLE regular_pay (
    regular_pay_id BIGINT AUTO_INCREMENT,
    member_id BIGINT,
    aid VARCHAR(50),
    tid VARCHAR(50),
    sid VARCHAR(50),
    PRIMARY KEY (regular_pay_id)
);


ALTER TABLE user
    ADD CONSTRAINT uq_user_email UNIQUE (email),
    MODIFY user_type ENUM('FREE', 'PAID', 'EXPERT', 'ADMIN') DEFAULT 'FREE',
    MODIFY is_deleted BOOLEAN DEFAULT FALSE,
    MODIFY created_at DATETIME DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE expert
    ADD CONSTRAINT uq_expert_user UNIQUE (user_id),
    MODIFY approval_status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',
    ADD CONSTRAINT fk_expert_user FOREIGN KEY (user_id) REFERENCES user(user_id);

ALTER TABLE post
    MODIFY only_expert BOOLEAN DEFAULT FALSE,
    MODIFY is_resolved BOOLEAN DEFAULT FALSE,
    MODIFY subscriber_type ENUM('FREE', 'PAID') DEFAULT 'FREE',
    MODIFY like_count INT UNSIGNED DEFAULT 0,
    MODIFY created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    MODIFY updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    ADD CONSTRAINT fk_post_user FOREIGN KEY (user_id) REFERENCES user(user_id);

ALTER TABLE post_tag
    ADD CONSTRAINT fk_posttag_post FOREIGN KEY (post_id) REFERENCES post(post_id),
    ADD CONSTRAINT fk_posttag_tag FOREIGN KEY (tag_id) REFERENCES tag(tag_id);

ALTER TABLE comment
    MODIFY like_count INT UNSIGNED DEFAULT 0,
    MODIFY created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    MODIFY updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    MODIFY is_accepted BOOLEAN DEFAULT FALSE,
    MODIFY is_deleted BOOLEAN DEFAULT FALSE,
    ADD CONSTRAINT fk_comment_post FOREIGN KEY (post_id) REFERENCES post(post_id),
    ADD CONSTRAINT fk_comment_user FOREIGN KEY (user_id) REFERENCES user(user_id);

ALTER TABLE report
    MODIFY created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    MODIFY status ENUM('PENDING', 'PROCESSED', 'REJECTED') DEFAULT 'PENDING',
    ADD CONSTRAINT fk_report_user FOREIGN KEY (user_id) REFERENCES user(user_id);

ALTER TABLE `like`
    ADD CONSTRAINT fk_like_user FOREIGN KEY (user_id) REFERENCES user(user_id);

ALTER TABLE lecture_room
    MODIFY is_paid BOOLEAN NOT NULL DEFAULT FALSE,
    MODIFY created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    MODIFY updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ADD CONSTRAINT fk_lecture_expert FOREIGN KEY (expert_id) REFERENCES expert(expert_id);


ALTER TABLE lecture
    MODIFY order_num INT NOT NULL,
    MODIFY created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    MODIFY updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ADD CONSTRAINT fk_lecture_room FOREIGN KEY (lecture_room_id) REFERENCES lecture_room(lecture_room_id);

ALTER TABLE lecture_tag
    ADD CONSTRAINT fk_lecturetag_lecture FOREIGN KEY (lecture_id) REFERENCES lecture(lecture_id),
    ADD CONSTRAINT fk_lecturetag_tag FOREIGN KEY (tag_id) REFERENCES tag(tag_id);

ALTER TABLE expert_tag
    ADD CONSTRAINT fk_experttag_expert FOREIGN KEY (expert_id) REFERENCES expert(expert_id),
    ADD CONSTRAINT fk_experttag_tag FOREIGN KEY (tag_id) REFERENCES tag(tag_id);

ALTER TABLE membership
    MODIFY enrolled_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ADD CONSTRAINT fk_membership_member FOREIGN KEY (member_id) REFERENCES user(user_id),
    ADD CONSTRAINT fk_membership_lecture FOREIGN KEY (lecture_room_id) REFERENCES lecture_room(lecture_room_id);

ALTER TABLE lecture_comment
    MODIFY content TEXT NOT NULL,
    MODIFY created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ADD CONSTRAINT fk_lecturecomment_member FOREIGN KEY (member_id) REFERENCES user(user_id),
    ADD CONSTRAINT fk_lecturecomment_lecture FOREIGN KEY (lecture_room_id) REFERENCES lecture_room(lecture_room_id);

ALTER TABLE pay_history
    MODIFY paid_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ADD CONSTRAINT fk_payhistory_member FOREIGN KEY (member_id) REFERENCES user(user_id);

ALTER TABLE regular_pay
    MODIFY aid VARCHAR(50) NOT NULL,
    MODIFY tid VARCHAR(50) NOT NULL,
    MODIFY sid VARCHAR(50) NOT NULL,
    ADD CONSTRAINT fk_regularpay_member FOREIGN KEY (member_id) REFERENCES user(user_id);
