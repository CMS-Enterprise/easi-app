import {
  GetLinkedRequests_cedarSystemDetails_cedarSystem_linkedSystemIntakes as LinkedSystemIntake,
  GetLinkedRequests_cedarSystemDetails_cedarSystem_linkedTrbRequests as LinkedTrbRequest
} from 'queries/types/GetLinkedRequests';

export type { LinkedSystemIntake, LinkedTrbRequest };
export type SystemLinkedRequest = LinkedSystemIntake | LinkedTrbRequest;
