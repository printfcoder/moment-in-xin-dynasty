-- SQLite
CREATE table people (
  id int PRIMARY AUTOINCREMENT UNIQUE,
  name varchar(20) not null,
  birthday varchar(20) not null,
  deathday varchar(20) not null
)

CREATE table people_occupation ( --人物职业时间表 
  id int(8) UNIQUE AUTOINCREMENT,
  people_id int not null,
  people_name varchar(20) not null,
  occupation_name   varchar(20) not null, -- 职业名
  occupation_begin_time varchar(20), -- 职业开始时间
  occupation_end_time varchar(20), -- 职业结束时间
  posthumous_title  varchar(20) -- 谥号
  temple_title varchar(20) -- 庙号
)
