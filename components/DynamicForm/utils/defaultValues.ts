import { FormConfig, FormFieldConfig, FormSectionConfig } from './types';

export const getDefaultValueByType = (field: FormFieldConfig): any => {
  // Use provided default value if available (which came from backend)
  if (field?.defaultValue !== undefined) {
    return field.defaultValue;
  }

  // Otherwise use type-specific defaults
  switch (field.type) {
    case 'number':
    case 'float':
      return 0;
    case 'boolean':
      return false;
    case 'checkbox':
      return [];
    case 'radio':
      return field.options?.[0]?.value ?? '';
    case 'url':
    case 'text':
    default:
      return '';
  }
};

export const createSectionDefaults = (section: FormSectionConfig) => {
  if (!section.enabled) {
    return section.isRepeatable ? [] : {};
  }

  const fieldDefaults = section.fields.reduce(
    (acc, field) => ({
      ...acc,
      [field.name]: getDefaultValueByType(field),
    }),
    {},
  );

  if (section.isRepeatable) {
    // TODO: uncomment below line if getting some error for default value realated to : useFieldArray()
    // return section.defaultValues?.length ? section.defaultValues : [];
    //  if default values are not provided, we need to create a default value for each field
    return section.defaultValues?.length
      ? section.defaultValues
      : [{ ...fieldDefaults }];
  }

  return { ...fieldDefaults, ...section.defaultValues };
};

export const createDefaultValues = (
  formConfig: FormConfig,
): Record<string, any> => {
  return formConfig?.sections?.reduce(
    (acc, section) => ({
      ...acc,
      [section.id]: createSectionDefaults(section),
    }),
    {},
  );
};
