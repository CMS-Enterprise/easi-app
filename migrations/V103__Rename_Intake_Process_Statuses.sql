UPDATE system_intakes
SET process_status = 'Initial development underway'
WHERE process_status = 'The project is already in development';

UPDATE system_intakes
SET process_status = ''
WHERE process_status = 'The project is already funded';
