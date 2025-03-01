import { Control } from 'react-hook-form';

import CustomFormField, { FormFieldType } from '@/components/CustomFormField';
import { FormFieldConfig } from '@/components/DynamicForm/utils/types';

interface DynamicFormFieldProps {
  field: FormFieldConfig;
  control: Control<any>;
  name: string;
  numbering?: string;
}

export const DynamicFormField = ({
  field,
  control,
  name,
  numbering,
}: DynamicFormFieldProps) => {
  const getFieldType = (type: string): FormFieldType => {
    switch (type) {
      case 'number':
      case 'float':
        return FormFieldType.NUMBER;
      case 'boolean':
        return FormFieldType.CHECKBOX;
      case 'phoneInput':
        return FormFieldType.PHONE_INPUT;
      case 'checkbox':
        return FormFieldType.CHECKBOX;
      case 'radio':
        return FormFieldType.RADIO;
      case 'url':
      case 'text':
      default:
        return FormFieldType.TEXT;
    }
  };

  return (
    <CustomFormField
      control={control}
      name={name}
      numbering={numbering}
      label={field.label}
      fieldType={getFieldType(field.type)}
      placeholder={field.placeholder}
      isAstrikRequired={field.validation?.required}
      iconSrc={field.icon?.src}
      iconAlt={field.icon?.alt}
      step={field.step?.toString()}
      // for type radio
      options={field.options as { value: string; label: string }[]}
      defaultValue={field.defaultValue}
    />
  );
};
