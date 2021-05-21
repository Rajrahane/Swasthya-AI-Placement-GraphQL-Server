drop database if exists blog_system;
create database blog_system;
use blog_system;


CREATE TABLE `user`(
	`id` int auto_increment PRIMARY KEY,
    `email_address` varchar(100) not null,
    `first_name` varchar(30),
    `last_name` varchar(30),
    `mobile_number` char(10),
    UNIQUE KEY `email_address_UNIQUE` (`email_address`)
);

create table `blog`(
	`id` int auto_increment primary key,
    `name` varchar(256)
);

create table `comment`(
	`id` int auto_increment primary key,
    `message` varchar(512),
    `blog_id` int not null,
    constraint COMMENT_FK_BLOG_ID foreign key (`blog_id`) references blog(`id`),    
    `user_id` int not null,
    constraint COMMENT_FK_USER_ID foreign key (`user_id`) references `user`(`id`)
);