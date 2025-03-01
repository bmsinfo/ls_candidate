import React from 'react';
import { Control } from 'react-hook-form';

import { X } from 'lucide-react';

import { FormSectionConfig } from '@/components/DynamicForm/utils/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import CustomFormField, { getFieldType } from '../CustomFormField';

interface FormSectionFieldsProps {
  section: FormSectionConfig;
  fields: Record<string, any>[];
  control: Control<any>;
  errors: any;
  onRemove: (index: number) => void;
  renderFieldsClassName?: string;
}

export const FormSectionFields = ({
  section,
  fields,
  control,
  errors,
  onRemove,
  renderFieldsClassName,
}: FormSectionFieldsProps) => {
  const renderFields = (fieldPrefix = '') => (
    <div
      className={cn(
        'grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-4',
        renderFieldsClassName,
      )}>
      {section.fields.map((field, index) => (
        <CustomFormField
          key={field.name}
          control={control}
          fieldType={getFieldType(field.type)}
          name={`${fieldPrefix}${field.name}`}
          numbering={section.numbering ? `${index + 1}). ` : undefined}
          label={field.label}
          placeholder={field.placeholder}
          iconSrc={field.icon?.src}
          iconAlt={field.icon?.alt}
          isAstrikRequired={field.validation?.required}
          step={field.step?.toString()}
          // options={field.options as { value: string; label: string }[]}
          // TODO: if future we need to remove below once we got data from backend as {value: string; label: string}[]
          // currently getting as ["option1", "option2"]
          options={field.options?.map((option: any) => ({
            label: option,
            value: option,
          }))}
          defaultValue={field.defaultValue}
        />
      ))}
    </div>
  );

  if (!section.isRepeatable) {
    return renderFields(section.id + '.');
  }

  return (
    <>
      {section.required && fields.length === 0 && (
        <span className="text-sm text-red-500">
          {section.messages?.required || 'At least one entry is required'}
        </span>
      )}

      {fields.map((field, index) => (
        <div className="flex flex-col gap-2 w-full" key={field.id}>
          <div className="">{renderFields(`${section.id}.${index}.`)}</div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="self-end"
            onClick={() => onRemove(index)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </>
  );
};
