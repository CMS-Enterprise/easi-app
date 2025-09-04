-- Create the trigger function. We want two parts. 1. Don't allow removing a requester if there isn't a requester.
-- 2. If a new requester is selected, deselect the old requester for that system intake
CREATE OR REPLACE FUNCTION check_system_intake_contacts_requester() RETURNS TRIGGER AS $requester_check$
BEGIN
    -- Avoid recursion by checking pg_trigger_depth()
    -- depth of 0 means not created from inside a trigger
    IF pg_trigger_depth() > 1 THEN
        RETURN NEW;
    END IF;

  --- Part 0 : Don't allow deletes of contacts that are the only requester.
    IF TG_OP = 'DELETE' AND OLD.is_requester = TRUE THEN
        IF NOT EXISTS (
            SELECT 1
            FROM system_intake_contacts
            WHERE system_intake_id = OLD.system_intake_id
                AND is_requester = TRUE
                AND id <> OLD.id
        ) THEN
            RAISE EXCEPTION 'Cannot delete a primary contact requester when no other requester exists';
        END IF;
    END IF;

    -- Part 1: Don't allow removing a requester if there isn't a requester.
    IF TG_OP = 'UPDATE' AND NEW.is_requester = FALSE THEN
        IF NOT EXISTS (
            SELECT 1
            FROM system_intake_contacts
            WHERE system_intake_id = NEW.system_intake_id
              AND is_requester = TRUE
              AND id <> NEW.id
        ) THEN
            RAISE EXCEPTION 'Cannot remove primary requester role when no other requester exists';
        END IF;
    END IF;

    -- Part 2: If a new requester is selected, deselect the old requester for that system intake
    IF  NEW.is_requester = TRUE THEN
        UPDATE system_intake_contacts
        SET is_requester = FALSE
        WHERE system_intake_id = NEW.system_intake_id
          AND id <> NEW.id
          AND is_requester = TRUE;
    END IF;

    RETURN NEW;
END
 $requester_check$ LANGUAGE plpgsql;


-- Create and register the triggers
-- Run this on UPDATE 
CREATE TRIGGER system_intake_contacts_requester_update
AFTER UPDATE ON system_intake_contacts
FOR EACH ROW
WHEN (OLD.is_requester = TRUE OR NEW.is_requester = TRUE)
EXECUTE FUNCTION check_system_intake_contacts_requester();
    
-- Run this on INSERT
CREATE TRIGGER system_intake_contacts_requester_insert
AFTER INSERT ON system_intake_contacts
FOR EACH ROW
WHEN (NEW.is_requester = TRUE)
EXECUTE FUNCTION check_system_intake_contacts_requester();

-- Run on Delete
CREATE TRIGGER system_intake_contacts_requester_delete
AFTER DELETE ON system_intake_contacts
FOR EACH ROW
WHEN (OLD.is_requester = TRUE)
EXECUTE FUNCTION check_system_intake_contacts_requester();
