

-- Creating vehicle_schedules_view

create view vehicle_schedules_view as
select `v`.`id` as 'vehicle_id' , `v`.`title` as 'vehicle_title', `v`.`plate` as 'vehicle_plate', `v`.`type` as 'vehicle_type', `v`.`year` as 'vehicle_year', `v`.`photo` as 'vehicle_photo', `v`.`manufacturer` as 'vehicle_manufacturer',  `s`.`start_date` as 'schedule_start_date', `s`.`end_date` as 'schedule_end_date' 
from vehicle v inner join  schedule s 
on v.id =  s.id_vehicle_fk;


-- Creating vehicle_schedule_user_view

create view vehicle_schedule_user_view as 
select `v`.`id` as 'vehicle_id' , `v`.`title` as 'vehicle_title', `v`.`plate` as 'vehicle_plate', `v`.`type` as 'vehicle_type', `v`.`year` as 'vehicle_year', `v`.`photo` as 'vehicle_photo', `v`.`manufacturer` as 'vehicle_manufacturer',
`s`.`id`as 'schedule_id', `s`.`start_date` as 'schedule_start_date', `s`.`end_date` as 'schedule_end_date', `s`.`reason` as 'schedule_reason', `u`.`name` as  'user_name'
from vehicle v inner join schedule s 
on v.id =  s.id_vehicle_fk inner join user u on u.id = s.id_user_fk;


-- Creating user_view
create view user_view as 
select `u`.`id` as 'user_id', `u`.`name` as 'user_name', `u`.`login` as 'user_login', `u`.`email` as 'user_email',
`u`.`cpf` as 'user_cpf', `u`.`phone` as 'user_phone', `u`.`admin` as 'user_admin', `u`.`date` as 'user_date'  
from user u; 

-- Creating user_permission_view

create view user_permission_view as 
select `u`.`id` as 'user_id', `u`.`login` as 'user_login', `p`.`title` as 'permission_title'
from user u inner join permission p;






