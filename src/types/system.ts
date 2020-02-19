export type ShortSystem = {
  id: string;
  name: string;
  acronym: string;
  slug: string;
  link: string;
};

// Redux store type for systems
export type SystemState = {
  allSystemShorts: ShortSystem[];
};
