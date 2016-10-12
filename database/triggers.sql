-- *Using the 'eiger_schema':
use `eiger_schema`;



-- *Removing the trigger first:
drop trigger if exists `book_schedule`;

-- *Creating the schedule booking trigger:
delimiter $$
create trigger `book_schedule` before insert on `schedule` for each row
begin
    
	declare `var_is_admin` BOOLEAN;
    declare `var_schedules_overlaping` INT;
    
    -- *Checking if it's starting the reservation before the ending date:
	if new.`end_date` > new.`start_date` then
		-- *If it is:
        -- *Retrieving the owner's admin status:
		select `admin` into `var_is_admin` from `user` where `id` = new.`id_user_owner_fk`;
        -- *Checking if the resource owner is an admin, or if it's the same as referenced on this reservation:
		if `var_is_admin` = true or new.`id_user_owner_fk` = new.`id_user_fk` then
			-- *If it is:
            -- *Querying for date overlaps, by comparing the existing schedules for this vehicle with the given reservation period:
			select count(*) into `var_schedules_overlaping` from `schedule` 
				where `id_vehicle_fk` = new.`id_vehicle_fk` 
                and new.`start_date` <= `end_date` 
                and new.`end_date` >= `start_date`;
			-- *Checking if there is some overlap on the given dates:
			if `var_schedules_overlaping` > 0 then
				-- *If there is:
                -- *Throwing an error:
				signal sqlstate '45000' set message_text = 'EIGER_VEHICLE_UNAVAILABLE';
			end if;
		else
			-- *If it isn't:
            -- *Throwing an error:
            
			signal sqlstate '45000' set message_text = 'EIGER_NOT_AUTHORIZED';
		end if;
	else
		-- *If it isn't:
        -- *Throwing an error:
		signal sqlstate '45000' set message_text = 'EIGER_INVALID_DATE';
	end if;
end
$$ delimiter ;