import React, { memo } from 'react';
import { useFormContext, useController } from 'react-hook-form';

import { FormData } from '@/components/DynamicForm/utils/types';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

import { FormLabel } from '../form';
import { ErrorMessage } from './ErrorMessage';

interface CheckboxOption {
  value: string;
  label: string;
}

interface CheckboxFieldProps {
  name: string;
  label: string;
  options: CheckboxOption[];
  required?: boolean;
  layout?: 'vertical' | 'horizontal';
  numbering?: string;
}

const CheckboxField = memo(function CheckboxField({
  name,
  label,
  options,
  required,
  layout = 'vertical',
  numbering,
}: CheckboxFieldProps) {
  const { control } = useFormContext<FormData>();
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    rules: { required },
  });

  const handleChange = (checked: boolean, value: string) => {
    // Handle checkbox field with multiple values
    const currentValue = Array.isArray(field.value)
      ? field.value
      : [field.value];
    const updatedValue = checked
      ? [...currentValue, value]
      : currentValue.filter((v: string) => v !== value);
    field.onChange(updatedValue);
  };

  return (
    <div className="space-y-2">
      <FormLabel className="font-14-20-400">
        {numbering}
        {label}
        {required && <span className="text-accent-red">*</span>}
      </FormLabel>
      <div
        className={cn('flex flex-wrap gap-4', {
          flex: layout === 'vertical',
        })}>
        {options.map((option) => (
          <div
            key={option.value}
            className="flex items-center space-x-2 border rounded-lg px-4 py-2">
            <Checkbox
              id={`${name}-${option.value}`}
              checked={(field.value || []).includes(option.value)}
              onCheckedChange={(checked) =>
                handleChange(checked as boolean, option.value)
              }
            />
            <label
              htmlFor={`${name}-${option.value}`}
              className="font-16-24-400 whitespace-nowrap">
              {option.label}
            </label>
          </div>
        ))}
      </div>
      <ErrorMessage message={error?.message} />
    </div>
  );
});

export { CheckboxField };
