import React, { memo, useCallback } from 'react';
import {
  useFormContext,
  useController,
  UseControllerProps,
} from 'react-hook-form';

import { FormData } from '@/components/DynamicForm/utils/types';
import { Input } from '@/components/ui/input';
import { cn, parseNumberValue } from '@/lib/utils';

import { FormLabel } from '../form';
import { ErrorMessage } from './ErrorMessage';
import { ImageWrapper } from './ImageWrapper';

export interface InputFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name' | 'type'> {
  label?: string;
  name: string;
  type: 'text' | 'email' | 'number' | 'password' | 'tel';
  required?: boolean;
  iconSrc?: string;
  iconAlt?: string;
  numbering?: string;
}

function useInputField(props: UseControllerProps<FormData>) {
  const {
    field,
    fieldState: { error },
  } = useController(props);
  return { ...field, error };
}

const InputField = memo(function InputField({
  name,
  label,
  numbering,
  type = 'text',
  placeholder = '',
  required = false,
  iconSrc,
  iconAlt = 'Icon',
  ...rest
}: InputFieldProps) {
  const { step } = rest;
  const { control } = useFormContext<FormData>();
  const { value, onChange, onBlur, error } = useInputField({
    name,
    control,
    rules: { required },
  });

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;

      if (type === 'number' && step && typeof step === 'string') {
        onChange(parseNumberValue(inputValue, step));
      } else {
        onChange(inputValue);
      }
    },
    [type, step, onChange],
  );

  return (
    <div className="space-y-2">
      {label && (
        <FormLabel className="font-14-20-400">
          {numbering}
          {label}
          {required && <span className="text-accent-red">*</span>}
        </FormLabel>
      )}

      <div className="flex rounded-lg h-11 border border-light-silver bg-dark-400">
        {iconSrc && <ImageWrapper src={iconSrc} alt={iconAlt} />}
        <Input
          id={name}
          type={type}
          placeholder={placeholder}
          value={value as string}
          onChange={handleChange}
          onBlur={onBlur}
          className={cn(
            'shadow-none border-0 h-11 rounded-lg focus-visible:ring-0 font-16-24-400 px-3',
            { 'text-accent-red': !!error },
          )}
          {...rest}
        />
      </div>
      <ErrorMessage message={error?.message} />
    </div>
  );
});

export { InputField };
