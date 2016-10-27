-- *Using utf8 as the default connection charset:
set names 'utf8';
-- *Using the 'eiger_schema':
use `eiger_schema`;

-- Creating user_insensitive_view
create view `user_insensitive_view` as
	select 	`u`.`id`,
			`u`.`name`,
            `u`.`login`,
            `u`.`email`,
            `u`.`department`,
            `u`.`photo`,
            `u`.`permission_schedules`,
            `u`.`permission_users`,
            `u`.`permission_vehicles`,
            `u`.`active`,
            `u`.`date`
from user u;
