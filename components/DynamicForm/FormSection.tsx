import React from 'react';
import { useFieldArray, Control } from 'react-hook-form';

import { FormSectionConfig } from '@/components/DynamicForm/utils/types';

import { FormSectionFields } from './FormSectionFields';
import { FormSectionHeader } from './FormSectionHeader';

interface FormSectionProps {
  section: FormSectionConfig;
  control: Control<any>;
  errors: any;
  renderFieldsClassName?: string;
}

export const FormSection = ({
  section,
  control,
  errors,
  renderFieldsClassName,
}: FormSectionProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: section.id,
    rules: {
      required: section.required,
    },
  });

  if (!section.enabled) return null;

  return (
    <div className="space-y-4">
      <FormSectionHeader
        section={section}
        canAddMore={!section.maxEntries || fields.length < section.maxEntries}
        onAdd={() => append({})}
      />

      <FormSectionFields
        section={section}
        fields={fields}
        control={control}
        errors={errors}
        onRemove={remove}
        renderFieldsClassName={renderFieldsClassName}
      />

      {/* {errors[section.id] && (
        <p className="text-sm  text-primary">{errors[section.id].message}</p>
      )} */}
    </div>
  );
};
