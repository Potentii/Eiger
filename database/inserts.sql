
-- Entering data in the table users

insert into user (`name`, `login`, `pass`, `email`, `cpf`, `phone`, `admin`)
values ('User1', 'user1.login', '1234', 'user1@eiger.com', '45920929103', '2080057', '0');

insert into user (`name`, `login`, `pass`, `email`, `cpf`, `phone`, `admin`)
values ('User2', 'user2.login', '1234', 'user2@eiger.com', '78706861318', '99360672', '1'); 

insert into user (`name`, `login`, `pass`, `email`, `cpf`, `phone`, `admin`)
values ('User3', 'user3.login', '1234', 'user3@eiger.com', '69572325221', '99367372', '0');




-- Entering data in the table vehicle

insert into vehicle (`title`, `plate`, `year`, `type`, `renavam`, `manufacturer`, `photo`) 
values ('V12 Vantage Coupe', 'BGQ8456', '2016', 'Sport', '56281020499','Audi', '01.jpg');

insert into vehicle (`title`, `plate`, `year`, `type`, `renavam`, `manufacturer`, `photo`) 
values ('CRV', 'MWL1385', '2011', 'SUV', '46778167745', 'Honda', '02.jpg');

insert into vehicle (`title`, `plate`, `year`, `type`, `renavam`, `manufacturer`, `photo`) 
values ('New Fiesta Hatch', 'JVH3845', '2013', 'Hatch Médio', '38164557560', 'Ford', '03.jpg');



-- Entering data in the table schedule

insert into schedule (`id_vehicle_fk`, `id_user_fk`, `start_date`,`end_date`, `reason`)
values ('2','3', '2016-09-19 08:00:00', '2016-09-19 17:00:00', 'Negócios');

insert into schedule (`id_vehicle_fk`, `id_user_fk`, `start_date`,`end_date`, `reason`)
values ('1', '1', '2016-09-20 10:30:00', '2016-09-27 15:00:00', 'Viagem');

insert into schedule (`id_vehicle_fk`, `id_user_fk`, `start_date`,`end_date`, `reason`)
values ('3','2', '2016-09-23 09:00:00', '016-09-25 19:00:00', 'Evento');




-- Entering data in the table permission

insert into permission (`title`)
values ('Hatch');

insert into permission (`title`)
values ('SUV');

insert into permission (`title`)
values ('Sport');





-- Entering data in the table user_permission

insert into user_permission (`id_user_fk`, `id_permission_fk`)
values('1', '1');

insert into user_permission (`id_user_fk`, `id_permission_fk`)
values('3', '2');

insert into user_permission (`id_user_fk`, `id_permission_fk`)
values('2', '3');

