CREATE USER 'sqladmin'@'localhost' IDENTIFIED BY 'admin'; GRANT ALL PRIVILEGES ON *.* TO 'sqladmin'@'localhost' WITH GRANT OPTION; FLUSH PRIVILEGES;
CREATE DATABASE hancom CHARACTER SET utf8 COLLATE utf8_general_ci;
USE hancom;

DROP TABLE license;
CREATE TABLE IF NOT EXISTS license (
  id           int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name         varchar(64) NOT NULL UNIQUE,        -- 상호명
  uid          varchar(64) NOT NULL UNIQUE,        -- 가맹점ID
  rcn          varchar(64) NOT NULL,               -- 사업자등록번호
  mac          varchar(64) NOT NULL UNIQUE,        -- 하드웨어주소
  token        varchar(64) NOT NULL UNIQUE,        -- 토큰
  updated      timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- 변경시간
  registered   timestamp DEFAULT CURRENT_TIMESTAMP -- 등록시간
);

DROP TABLE receipt;
CREATE TABLE IF NOT EXISTS receipt (
  id           int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  uid          varchar(64) NOT NULL,       -- 가맹점ID
  rno          varchar(64) NOT NULL,       -- 영수증번호ID
  name         varchar(64) NOT NULL,       -- 상호명
  rcn          varchar(64) NOT NULL,       -- 사업자등록번호
  escp         varchar(4096) NOT NULL,     -- ESC/P
  text         varchar(8192) NOT NULL,     -- 텍스트
  items        varchar(8192) NOT NULL,     -- 물품목록
  updated      timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- 변경시간
  registered   timestamp DEFAULT CURRENT_TIMESTAMP -- 등록시간
);

