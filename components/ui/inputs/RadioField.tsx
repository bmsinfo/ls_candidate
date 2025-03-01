import React from 'react';
import {
  useController,
  UseControllerProps,
  useFormContext,
} from 'react-hook-form';

import { FormData } from '@/components/DynamicForm/utils/types';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';

import { FormLabel } from '../form';
import { ErrorMessage } from './ErrorMessage';

interface RadioFieldProps {
  name: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  options: {
    label: string;
    value: string;
  }[];
  defaultValue?: string;
  numbering?: string;
  //   layout: 'vertical' | 'horizontal';  //TODO: implement in future
}
export function useFieldControl(props: UseControllerProps<FormData>) {
  const {
    field,
    fieldState: { error },
  } = useController(props);

  return { ...field, error };
}

export const RadioField = React.memo(function RadioField({
  name,
  label,
  required = false,
  options = [],
  numbering,
  defaultValue,
  //   layout = 'vertical',
  ...rest
}: RadioFieldProps) {
  console.log({ name, defaultValue });
  const { control } = useFormContext<FormData>();

  const { value, onChange, error } = useFieldControl({
    name,
    control,
    rules: { required },
    defaultValue,
  });
  console.log({ RadioField: value });

  return (
    <div className="space-y-2">
      {label && (
        <FormLabel className="font-14-20-400">
          {numbering}
          {label}
          {required && <span className="text-accent-red">*</span>}
        </FormLabel>
      )}

      <RadioGroup
        value={value as string}
        onValueChange={onChange}
        className={cn('flex flex-wrap gap-x-4', {
          //   'flex gap-x-4': layout === 'horizontal',
        })}
        {...rest}>
        {options.map((option) => (
          <div
            key={option.value}
            className="flex items-center space-x-2 border rounded-lg px-4 py-2">
            <RadioGroupItem
              value={option.value}
              id={`${name}-${option.value}`}
            />
            <label
              htmlFor={`${name}-${option.value}`}
              className="font-16-24-400">
              {option.label}
            </label>
          </div>
        ))}
      </RadioGroup>

      <ErrorMessage message={error?.message} />
    </div>
  );
});
