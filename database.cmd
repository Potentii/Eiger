cd ./database
mysql --host=localhost --user=eiger_db --password=asd123! -e "source tables.sql"
mysql --host=localhost --user=eiger_db --password=asd123! -e "source views.sql"
mysql --host=localhost --user=eiger_db --password=asd123! -e "source triggers.sql"
mysql --host=localhost --user=eiger_db --password=asd123! -e "source inserts.sql"
