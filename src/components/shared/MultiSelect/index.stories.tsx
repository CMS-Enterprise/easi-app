import React from 'react';
import { Control, Controller, useForm } from 'react-hook-form';
import { ComponentMeta } from '@storybook/react';

import MultiSelect from '.';

type FormData = {
  multiselect: string[];
};

function RhfWrapper({
  render,
  defaultValues
}: {
  render?: (control: Control<FormData, any>) => React.ReactNode;
  defaultValues: FormData;
}) {
  const { control, watch } = useForm<FormData>({
    defaultValues
  });
  return (
    <>
      <form>{render?.(control)}</form>
      <div className="margin-y-4 border-top">
        <pre>{JSON.stringify(watch(), null, 2)}</pre>
      </div>
    </>
  );
}

export default {
  title: 'MultiSelect',
  component: MultiSelect
} as ComponentMeta<typeof MultiSelect>;

export const WithReactHookForm = () => {
  return (
    <RhfWrapper
      defaultValues={{ multiselect: ['e'] }}
      render={control => (
        <Controller
          name="multiselect"
          control={control}
          render={({ field }) => (
            <MultiSelect
              id="multiselect"
              name={field.name}
              options={[
                { label: 'EASi', value: 'e' },
                { label: 'peasy', value: 'p' },
                { label: 'lemon', value: 'l' },
                { label: 'squeezy', value: 's' }
              ]}
              initialValues={field.value}
              onChange={field.onChange}
            />
          )}
        />
      )}
    />
  );
};
