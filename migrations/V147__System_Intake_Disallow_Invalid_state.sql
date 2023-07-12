ALTER TABLE system_intakes
ADD CONSTRAINT system_intake_decision_step_requires_a_decision
    CHECK ((step <> 'DECISION_AND_NEXT_STEPS'::system_intake_step) OR (step = 'DECISION_AND_NEXT_STEPS'::system_intake_step AND decision_state <> 'NO_DECISION'::system_intake_decision_state));


 COMMENT ON CONSTRAINT system_intake_decision_step_requires_a_decision ON system_intakes IS
 'This constraint ensures that the system intake is always in a valid state. Specifically, it requires that a decision has been made if the step is "DECISION_AND_NEXT_STEPS". Otherwise the decision state can be any value';
