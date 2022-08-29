-- SQLite
CREATE table people
(
    id       integer primary key autoincrement,
    name     varchar(20) not null,
    birthday varchar(20) not null,
    deathday varchar(20) not null
);

create table people_occupation  -- 人物职业时间表 
(
    id                    INTEGER
        primary key autoincrement,
    people_id             INT         not null,
    people_name           varchar(20) not null,
    occupation_name       varchar(20) not null,  -- 职业名
    occupation_begin_time varchar(20), -- 职业开始时间
    occupation_end_time   varchar(20), -- 职业结束时间
    posthumous_title      varchar(20), -- 谥号
    temple_title          varchar(20), -- 庙号
    reference             TEXT 
);

