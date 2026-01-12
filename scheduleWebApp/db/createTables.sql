-- ユーザ(users)テーブル
CREATE TABLE users (
  user_id   VARCHAR(50) PRIMARY KEY,
  name      VARCHAR(100) NOT NULL,
  email     VARCHAR(100),
  role      VARCHAR(50)
);

-- 定期予約ルール(recurring_rules)テーブル
CREATE TABLE recurring_rules (
  rule_id      INT AUTO_INCREMENT PRIMARY KEY,
  created_by   VARCHAR(50) NOT NULL,
  title        VARCHAR(100) NOT NULL,
  frequency    ENUM('WEEKLY', 'BIWEEKLY') NOT NULL,          -- 毎週 or 隔週
  weekday TINYINT NOT NULL CHECK (weekday BETWEEN 0 AND 6),  -- 0=日曜, 1=月曜...
  start_time   TIME NOT NULL,   -- 09:00
  end_time     TIME NOT NULL,   -- 10:00
  start_date   DATE NOT NULL,
  end_date     DATE NOT NULL,
  location     VARCHAR(50),
  memo         VARCHAR(1000),
  color_name   VARCHAR(30),
  FOREIGN KEY (created_by) REFERENCES users(user_id)
);

-- スケジュール(schedules)テーブル
CREATE TABLE schedules (
  schedule_id       INT AUTO_INCREMENT PRIMARY KEY,
  title             VARCHAR(100) NOT NULL,
  start_datetime    DATETIME NOT NULL,
  end_datetime      DATETIME,
  location          VARCHAR(50),
  memo              VARCHAR(1000),
  color_name        VARCHAR(30),
  created_by        VARCHAR(50) NOT NULL,
  recurring_rule_id INT NULL,  -- 定期予約由来なら紐づく
  FOREIGN KEY (created_by) REFERENCES users(user_id),
  FOREIGN KEY (recurring_rule_id) REFERENCES recurring_rules(rule_id)
);

-- ユーザスケジュール(user_schedule)テーブル
CREATE TABLE user_schedule (
  user_id     VARCHAR(50) NOT NULL,
  schedule_id INT NOT NULL,
  PRIMARY KEY (user_id, schedule_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (schedule_id) REFERENCES schedules(schedule_id) ON DELETE CASCADE
);

-- 色(color)テーブル
CREATE TABLE colors (
  color_id     INT AUTO_INCREMENT PRIMARY KEY,
  color_name VARCHAR(30) NOT NULL UNIQUE,   -- 例: 赤, 青, 緑, オレンジ
  color_code   CHAR(7) NOT NULL             -- 例: #FF0000
);

-- インデックス設定
-- schedules
CREATE INDEX idx_schedules_start ON schedules(start_datetime);
CREATE INDEX idx_schedules_created_by ON schedules(created_by);
CREATE INDEX idx_schedules_color ON schedules(color_name);
CREATE INDEX idx_schedules_rule ON schedules(recurring_rule_id);

-- user_schedule
CREATE INDEX idx_user_schedule_user ON user_schedule(user_id);
CREATE INDEX idx_user_schedule_schedule ON user_schedule(schedule_id);

-- users
CREATE INDEX idx_users_name ON users(name);

-- colors
CREATE INDEX idx_colors_name ON colors(color_name);

-- recurring_rules
CREATE INDEX idx_rules_created_by ON recurring_rules(created_by);
CREATE INDEX idx_rules_date ON recurring_rules(start_date, end_date);