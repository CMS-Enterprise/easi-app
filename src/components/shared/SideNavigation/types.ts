export type SubNavLinkProps = {
  route: string;
  text: string;
};

export type NavLinkProps = SubNavLinkProps & {
  children?: SubNavLinkProps[];
  /** Designates end of navigation group with bottom border */
  groupEnd?: boolean;
};
