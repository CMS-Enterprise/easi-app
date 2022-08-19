import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { Form, Formik, FormikValues } from 'formik';

import { RadioOptionGroupWithAdditionalText } from '.';

export default {
  title: 'RadioOptionGroupWithAdditionalText',
  component: RadioOptionGroupWithAdditionalText,
  decorators: [
    Story => (
      <Formik
        initialValues={{ pet: 'BeardedDragon', petAdditionalText: '' }}
        onSubmit={(values: FormikValues) => {}}
      >
        {({ values }) => (
          <>
            <Form>
              <Story />
            </Form>
            <div className="margin-y-4 border-top">
              <pre>{JSON.stringify(values, null, 2)}</pre>
            </div>
          </>
        )}
      </Formik>
    )
  ]
} as ComponentMeta<typeof RadioOptionGroupWithAdditionalText>;

export const Default = () => (
  <RadioOptionGroupWithAdditionalText
    name="pet"
    fieldsetLegend="Types of exotic pets"
    options={[
      { key: 'bearded-dragon', value: 'BeardedDragon', text: 'Bearded Dragon' },
      {
        key: 'red-knee-tarantula',
        value: 'RedKneeTarantula',
        text: 'Red Knee Tarantula'
      },
      {
        key: 'other',
        value: 'Other',
        text: 'Other exotic pet'
      }
    ]}
    optionKeyForTextInput="other"
    textInputLabel="What exotic pet is this?"
  />
);
