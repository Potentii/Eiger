-- *Using the 'eiger_schema':
use `eiger_schema`;


-- *Cleaning all the tables:
set FOREIGN_KEY_CHECKS = 0;
truncate table `auth`;
truncate table `user_permission`;
truncate table `permission`;
truncate table `schedule`;
truncate table `vehicle`;
truncate table `user`;
set FOREIGN_KEY_CHECKS = 1;


-- *Registering some users:
insert into `user` (`name`, `login`, `pass`, `email`, `cpf`, `phone`, `admin`)
	values ('User1', 'admin', '1', 'admin@eiger.com', '45920929103', '2080057', true);
insert into `user` (`name`, `login`, `pass`, `email`, `cpf`, `phone`, `admin`)
	values ('User2', 'user2.login', '1234', 'user2@eiger.com', '78706861318', '99360672', false); 
insert into `user` (`name`, `login`, `pass`, `email`, `cpf`, `phone`, `admin`)
	values ('User3', 'user3.login', 'abcd', 'user3@eiger.com', '69572325221', '99367372', false);


-- *Registering some vehicles:
insert into `vehicle` (`title`, `plate`, `year`, `type`, `renavam`, `manufacturer`, `photo`) 
	values ('V12 Vantage Coupe', 'BGQ8456', 2016, 'Sport', '56281020499','Audi', '01.jpg');
insert into `vehicle` (`title`, `plate`, `year`, `type`, `renavam`, `manufacturer`, `photo`) 
	values ('CRV', 'MWL1385', 2011, 'SUV', '46778167745', 'Honda', '02.jpg');
insert into `vehicle` (`title`, `plate`, `year`, `type`, `renavam`, `manufacturer`, `photo`) 
	values ('New Fiesta Hatch', 'JVH3845', 2013, 'Hatch Médio', '38164557560', 'Ford', '03.jpg');


-- *Booking new schedules:
insert into `schedule` (`id_vehicle_fk`, `id_user_fk`, `start_date`, `end_date`, `reason`, `id_user_owner_fk`)
				values (2, 3, '2016-10-01 08:00:00', '2016-10-01 17:00:00', 'Negócios', 1);
insert into `schedule` (`id_vehicle_fk`, `id_user_fk`, `start_date`, `end_date`, `reason`, `id_user_owner_fk`)
				values (1, 1, '2016-10-03 10:30:00', '2016-10-04 15:00:00', 'Viagem para a filial', 1);
insert into `schedule` (`id_vehicle_fk`, `id_user_fk`, `start_date`, `end_date`, `reason`, `id_user_owner_fk`)
				values (1, 2, '2016-10-04 16:00:00', '2016-10-04 20:00:00', 'Reunião com gerentes', 2);
insert into `schedule` (`id_vehicle_fk`, `id_user_fk`, `start_date`, `end_date`, `reason`, `id_user_owner_fk`)
				values (1, 2, '2016-10-05 09:00:00', '2016-10-05 18:00:00', 'Visita ao cliente', 1);
insert into `schedule` (`id_vehicle_fk`, `id_user_fk`, `start_date`, `end_date`, `reason`, `id_user_owner_fk`)
				values (1, 1, '2016-10-06 08:00:00', '2016-10-07 10:00:00', 'Viagem para a sede', 1);
insert into `schedule` (`id_vehicle_fk`, `id_user_fk`, `start_date`, `end_date`, `reason`, `id_user_owner_fk`)
				values (3, 2, '2016-10-04 09:00:00', '2016-10-04 19:00:00', 'Evento da empresa', 2);
                

-- *Inserting the system's permissions:
insert into `permission` (`title`)
	values ('users-view');
insert into `permission` (`title`)
	values ('users-modify');
insert into `permission` (`title`)
	values ('vehicles-view');
insert into `permission` (`title`)
	values ('vehicles-modify');
insert into `permission` (`title`)
	values ('schedules-view');
insert into `permission` (`title`)
	values ('schedules-modify');


-- *Setting the permissions level for each user:
insert into `user_permission` (`id_user_fk`, `id_permission_fk`)
	values(1, 1);
insert into `user_permission` (`id_user_fk`, `id_permission_fk`)
	values(1, 2);
insert into `user_permission` (`id_user_fk`, `id_permission_fk`)
	values(1, 3);
insert into `user_permission` (`id_user_fk`, `id_permission_fk`)
	values(1, 4);
insert into `user_permission` (`id_user_fk`, `id_permission_fk`)
	values(1, 5);
insert into `user_permission` (`id_user_fk`, `id_permission_fk`)
	values(1, 6);

insert into `user_permission` (`id_user_fk`, `id_permission_fk`)
	values(2, 1);
insert into `user_permission` (`id_user_fk`, `id_permission_fk`)
	values(2, 3);
insert into `user_permission` (`id_user_fk`, `id_permission_fk`)
	values(2, 4);
insert into `user_permission` (`id_user_fk`, `id_permission_fk`)
	values(2, 5);
insert into `user_permission` (`id_user_fk`, `id_permission_fk`)
	values(2, 6);

insert into `user_permission` (`id_user_fk`, `id_permission_fk`)
	values(3, 1);
insert into `user_permission` (`id_user_fk`, `id_permission_fk`)
	values(3, 3);
insert into `user_permission` (`id_user_fk`, `id_permission_fk`)
	values(3, 5);
insert into `user_permission` (`id_user_fk`, `id_permission_fk`)
	values(3, 6);