export type NonNullableProps<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};

export type FormFieldProps<T> = NonNullableProps<Required<T>>;
