import { useFieldArray, Control } from 'react-hook-form';

import Image from 'next/image';

import { X } from 'lucide-react';

import { CertificateFieldConfig } from '@/components/DynamicForm/utils/types';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

import { DynamicFormField } from '../DynamicForm/DynamicFormField';

interface CertificateFieldsProps {
  control: Control<any>;
  config: CertificateFieldConfig;
  errors: any;
}

export const CertificateFields = ({
  control,
  config,
  errors,
}: CertificateFieldsProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'certificates',
  });

  if (!config?.enabled) return null;

  const canAddMore = !config.maxEntries || fields.length < config.maxEntries;

  return (
    <div>
      <div className="flex my-4 items-center justify-between">
        <Label className="font-18-28-600">Certifications</Label>
        {canAddMore && (
          <Button
            type="button"
            variant="nohover"
            size="sm"
            className="bg-transparent"
            onClick={() =>
              append(
                config.fields.reduce(
                  (acc, field) => ({
                    ...acc,
                    [field.name]: '',
                  }),
                  {},
                ),
              )
            }>
            <Image
              src="/icons/plus.svg"
              alt="plus icon"
              width={20}
              height={20}
            />
            <span className="font-14-20-600 text-primary ml-2">
              Add Certification
            </span>
          </Button>
        )}
      </div>

      {config.required && fields.length === 0 && (
        <span className="text-sm">
          <span className="text-red-500 mr-2">*</span>At least one certification
          is required
        </span>
      )}

      {fields.map((field, index) => (
        <div key={field.id} className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-x-8 gap-4">
            {config.fields.map((fieldConfig) => (
              <DynamicFormField
                key={fieldConfig.name}
                field={fieldConfig}
                control={control}
                name={`certificates.${index}.${fieldConfig.name}`}
              />
            ))}
            <div className="flex items-end justify-start mb-1">
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => remove(index)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}

      {errors?.certificates && (
        <p className="text-sm text-accent-red">{errors.certificates.message}</p>
      )}
    </div>
  );
};
