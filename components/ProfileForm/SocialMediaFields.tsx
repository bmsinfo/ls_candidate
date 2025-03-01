import { Control } from 'react-hook-form';

import { FormFieldConfig } from '@/components/DynamicForm/utils/types';

import { DynamicFormField } from '../DynamicForm/DynamicFormField';

interface SocialMediaFieldsProps {
  control: Control<any>;
  fields: FormFieldConfig[];
}

export const SocialMediaFields = ({
  control,
  fields,
}: SocialMediaFieldsProps) => {
  return (
    <div className="grid grid-cols-2 gap-x-8 gap-4">
      {fields?.map((field) => (
        <div key={field.name} className="space-y-2">
          <DynamicFormField field={field} control={control} name={field.name} />
        </div>
      ))}
    </div>
  );
};
