
-- 学生成绩管理系统核心表结构与初始化数据
-- 1. 租户表
CREATE TABLE IF NOT EXISTS tenant (
	id BIGINT PRIMARY KEY AUTO_INCREMENT,
	name VARCHAR(64) NOT NULL,
	status VARCHAR(16) DEFAULT 'ENABLED',
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO tenant (name) VALUES ('默认租户');

-- 2. 校区表
CREATE TABLE IF NOT EXISTS campus (
	id BIGINT PRIMARY KEY AUTO_INCREMENT,
	tenant_id BIGINT NOT NULL,
	name VARCHAR(64) NOT NULL,
	address VARCHAR(128),
	status VARCHAR(16) DEFAULT 'ENABLED',
	FOREIGN KEY (tenant_id) REFERENCES tenant(id)
);
INSERT INTO campus (tenant_id, name, address) VALUES (1, '主校区', '中国某市大学路1号');

-- 3. 班级表
CREATE TABLE IF NOT EXISTS class (
	id BIGINT PRIMARY KEY AUTO_INCREMENT,
	name VARCHAR(64) NOT NULL,
	grade_year INT,
	major VARCHAR(64)
);
INSERT INTO class (name, grade_year, major) VALUES ('计科2301', 2023, '计算机科学与技术');

-- 4. 学生表
CREATE TABLE IF NOT EXISTS student (
	id BIGINT PRIMARY KEY AUTO_INCREMENT,
	student_no VARCHAR(32) NOT NULL UNIQUE,
	name VARCHAR(32) NOT NULL,
	gender VARCHAR(8),
	class_id BIGINT,
	status VARCHAR(16) DEFAULT 'ACTIVE',
	enroll_year INT,
	tenant_id BIGINT,
	campus_id BIGINT,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	FOREIGN KEY (class_id) REFERENCES class(id),
	FOREIGN KEY (tenant_id) REFERENCES tenant(id),
	FOREIGN KEY (campus_id) REFERENCES campus(id)
);
INSERT INTO student (student_no, name, gender, class_id, enroll_year, tenant_id, campus_id) VALUES
('20230001', '张三', '男', 1, 2023, 1, 1),
('20230002', '李四', '女', 1, 2023, 1, 1);

-- 5. 教师表
CREATE TABLE IF NOT EXISTS teacher (
	id BIGINT PRIMARY KEY AUTO_INCREMENT,
	teacher_no VARCHAR(32) NOT NULL UNIQUE,
	name VARCHAR(32) NOT NULL,
	dept VARCHAR(64),
	status VARCHAR(16) DEFAULT 'ACTIVE',
	tenant_id BIGINT,
	campus_id BIGINT,
	FOREIGN KEY (tenant_id) REFERENCES tenant(id),
	FOREIGN KEY (campus_id) REFERENCES campus(id)
);
INSERT INTO teacher (teacher_no, name, dept, tenant_id, campus_id) VALUES
('T001', '王老师', '计算机学院', 1, 1);

-- 6. 课程表
CREATE TABLE IF NOT EXISTS course (
	id BIGINT PRIMARY KEY AUTO_INCREMENT,
	course_code VARCHAR(32) NOT NULL UNIQUE,
	name VARCHAR(64) NOT NULL,
	credit DECIMAL(3,1),
	dept VARCHAR(64),
	term VARCHAR(16),
	teacher_id BIGINT,
	tenant_id BIGINT,
	campus_id BIGINT,
	FOREIGN KEY (teacher_id) REFERENCES teacher(id),
	FOREIGN KEY (tenant_id) REFERENCES tenant(id),
	FOREIGN KEY (campus_id) REFERENCES campus(id)
);
INSERT INTO course (course_code, name, credit, dept, term, teacher_id, tenant_id, campus_id) VALUES
('CS101', '程序设计基础', 3.0, '计算机学院', '2023秋', 1, 1, 1);

-- 7. 成绩表
CREATE TABLE IF NOT EXISTS grade (
	id BIGINT PRIMARY KEY AUTO_INCREMENT,
	student_id BIGINT NOT NULL,
	course_id BIGINT NOT NULL,
	term VARCHAR(16),
	score_raw DECIMAL(5,2),
	score_final DECIMAL(5,2),
	grade_point DECIMAL(3,2),
	status VARCHAR(16) DEFAULT 'NORMAL',
	approval_state VARCHAR(16) DEFAULT 'DRAFT',
	tenant_id BIGINT,
	campus_id BIGINT,
	audit_state VARCHAR(16),
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	FOREIGN KEY (student_id) REFERENCES student(id),
	FOREIGN KEY (course_id) REFERENCES course(id),
	FOREIGN KEY (tenant_id) REFERENCES tenant(id),
	FOREIGN KEY (campus_id) REFERENCES campus(id)
);
INSERT INTO grade (student_id, course_id, term, score_raw, score_final, grade_point, tenant_id, campus_id) VALUES
(1, 1, '2023秋', 95, 95, 4.0, 1, 1),
(2, 1, '2023秋', 88, 88, 3.5, 1, 1);

-- 8. 用户表
CREATE TABLE IF NOT EXISTS user (
	id BIGINT PRIMARY KEY AUTO_INCREMENT,
	username VARCHAR(32) NOT NULL UNIQUE,
	password_hash VARCHAR(128) NOT NULL,
	role VARCHAR(16) NOT NULL,
	ref_type VARCHAR(16),
	ref_id BIGINT,
	enabled BOOLEAN DEFAULT TRUE,
	last_login_at TIMESTAMP,
	tenant_id BIGINT,
	campus_id BIGINT,
	FOREIGN KEY (tenant_id) REFERENCES tenant(id),
	FOREIGN KEY (campus_id) REFERENCES campus(id)
);
-- 密码为明文123456的bcrypt哈希（示例）
INSERT INTO user (username, password_hash, role, ref_type, ref_id, tenant_id, campus_id) VALUES
('admin', '$2a$10$7QJ8Qw6Qw6Qw6Qw6Qw6QwOQw6Qw6Qw6Qw6Qw6Qw6Qw6Qw6Qw6Qw6', 'ADMIN', NULL, NULL, 1, 1),
('teacher1', '$2a$10$7QJ8Qw6Qw6Qw6Qw6Qw6QwOQw6Qw6Qw6Qw6Qw6Qw6Qw6Qw6Qw6', 'TEACHER', 'teacher', 1, 1, 1),
('student1', '$2a$10$7QJ8Qw6Qw6Qw6Qw6Qw6QwOQw6Qw6Qw6Qw6Qw6Qw6Qw6Qw6Qw6', 'STUDENT', 'student', 1, 1, 1);

-- 9. 审计日志表
CREATE TABLE IF NOT EXISTS audit_log (
	id BIGINT PRIMARY KEY AUTO_INCREMENT,
	entity VARCHAR(32),
	entity_id BIGINT,
	action VARCHAR(16),
	operator_id BIGINT,
	before_json TEXT,
	after_json TEXT,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. 学期表
CREATE TABLE IF NOT EXISTS semester (
	id BIGINT PRIMARY KEY AUTO_INCREMENT,
	name VARCHAR(32) NOT NULL,
	start_date DATE,
	end_date DATE,
	status VARCHAR(16) DEFAULT 'ACTIVE'
);
INSERT INTO semester (name, start_date, end_date) VALUES ('2023秋', '2023-09-01', '2024-01-15');

-- 11. 成绩审批表
CREATE TABLE IF NOT EXISTS grade_approval (
	id BIGINT PRIMARY KEY AUTO_INCREMENT,
	grade_id BIGINT NOT NULL,
	version INT DEFAULT 1,
	submitter_id BIGINT,
	reviewer_id BIGINT,
	status VARCHAR(16) DEFAULT 'DRAFT',
	submit_at TIMESTAMP,
	review_at TIMESTAMP,
	comment VARCHAR(255),
	FOREIGN KEY (grade_id) REFERENCES grade(id)
);

-- 12. 通知表
CREATE TABLE IF NOT EXISTS notification (
	id BIGINT PRIMARY KEY AUTO_INCREMENT,
	tenant_id BIGINT,
	campus_id BIGINT,
	type VARCHAR(16),
	title VARCHAR(64),
	content TEXT,
	target_role VARCHAR(16),
	target_id BIGINT,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	read_flag BOOLEAN DEFAULT FALSE,
	FOREIGN KEY (tenant_id) REFERENCES tenant(id),
	FOREIGN KEY (campus_id) REFERENCES campus(id)
);

-- 13. 速率限制日志表
CREATE TABLE IF NOT EXISTS rate_limit_log (
	id BIGINT PRIMARY KEY AUTO_INCREMENT,
	key_hash VARCHAR(64),
	window_start TIMESTAMP,
	counter INT,
	last_access_at TIMESTAMP
);
