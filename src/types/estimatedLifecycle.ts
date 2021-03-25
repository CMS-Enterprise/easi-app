export type LifecycleCosts = {
  development: {
    isPresent: boolean;
    cost: string;
  };
  operationsMaintenance: {
    isPresent: boolean;
    cost: string;
  };
  other: {
    isPresent: boolean;
    cost: string;
  };
};
