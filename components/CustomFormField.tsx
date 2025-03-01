/* eslint-disable no-unused-vars */
import ReactDatePicker from 'react-datepicker';
import { Control } from 'react-hook-form';
import PhoneInput from 'react-phone-number-input';

import { E164Number } from 'libphonenumber-js/core';

import { FormControl, FormField, FormItem } from './ui/form';
import { CheckboxField } from './ui/inputs/CheckboxField';
import { ImageWrapper } from './ui/inputs/ImageWrapper';
import { InputField } from './ui/inputs/InputField';
import { RadioField } from './ui/inputs/RadioField';
import { Select, SelectContent, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';

export enum FormFieldType {
  TEXT = 'text',
  TEXTAREA = 'textarea',
  PHONE_INPUT = 'phoneInput',
  CHECKBOX = 'checkbox',
  DATE_PICKER = 'datePicker',
  SELECT = 'select',
  SKELETON = 'skeleton',
  NUMBER = 'number',
  RADIO = 'radio',
}

export const getFieldType = (type: string): FormFieldType => {
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

interface CustomProps {
  control: Control<any>;
  name: string;
  label?: string;
  placeholder?: string;
  iconSrc?: string;
  iconAlt?: string;
  disabled?: boolean;
  dateFormat?: string;
  showTimeSelect?: boolean;
  children?: React.ReactNode;
  renderSkeleton?: (field: any) => React.ReactNode;
  fieldType: FormFieldType;
  isAstrikRequired?: boolean;
  step?: string;
  // for type radio
  options?: { value: string; label: string }[];
  defaultValue?: string;
  numbering?: string;
}

const RenderInput = ({ field, props }: { field: any; props: CustomProps }) => {
  switch (props.fieldType) {
    case FormFieldType.NUMBER:
      return (
        <InputField
          type={'number'}
          name={props.name}
          label={props.label}
          iconSrc={props.iconSrc}
          iconAlt={props.iconAlt}
          required={props.isAstrikRequired}
          placeholder={props.placeholder}
          disabled={props.disabled}
          step={props.step}
          numbering={props.numbering}
        />
      );
    case FormFieldType.TEXT:
      return (
        <InputField
          type={'text'}
          name={props.name}
          label={props.label}
          iconSrc={props.iconSrc}
          iconAlt={props.iconAlt}
          required={props.isAstrikRequired}
          placeholder={props.placeholder}
          disabled={props.disabled}
          numbering={props.numbering}
        />
      );

    case FormFieldType.RADIO:
      return (
        <RadioField
          name={props.name}
          options={props.options as { value: string; label: string }[]}
          label={props.label}
          disabled={props?.disabled}
          required={props.isAstrikRequired}
          defaultValue={props.defaultValue}
          numbering={props.numbering}
        />
      );

    case FormFieldType.CHECKBOX:
      return (
        <CheckboxField
          name={props.name}
          label={props.label as string}
          required={props.isAstrikRequired}
          options={props.options as { value: string; label: string }[]}
          numbering={props.numbering}
        />
      );
    case FormFieldType.TEXTAREA:
      return (
        <FormControl>
          <Textarea
            placeholder={props.placeholder}
            {...field}
            className="shad-textArea"
            disabled={props.disabled}
          />
        </FormControl>
      );
    case FormFieldType.PHONE_INPUT:
      return (
        <FormControl>
          <PhoneInput
            defaultCountry="US"
            placeholder={props.placeholder}
            international
            withCountryCallingCode
            value={field.value as E164Number | undefined}
            onChange={field.onChange}
            className="input-phone"
          />
        </FormControl>
      );

    case FormFieldType.DATE_PICKER:
      return (
        <div className="flex rounded-md border border-dark-500 bg-dark-400">
          <ImageWrapper src={'/assets/icons/calendar.svg'} alt={'calendar'} />
          <FormControl>
            <ReactDatePicker
              showTimeSelect={props.showTimeSelect ?? false}
              selected={field.value}
              onChange={(date: Date | any) => field.onChange(date)}
              timeInputLabel="Time:"
              dateFormat={props.dateFormat ?? 'MM/dd/yyyy'}
              wrapperClassName="date-picker"
            />
          </FormControl>
        </div>
      );
    case FormFieldType.SELECT:
      return (
        <FormControl>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="shad-select-trigger">
                <SelectValue placeholder={props.placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="shad-select-content">
              {props.children}
            </SelectContent>
          </Select>
        </FormControl>
      );
    case FormFieldType.SKELETON:
      return props.renderSkeleton ? props.renderSkeleton(field) : null;
    default:
      return null;
  }
};

const CustomFormField = (props: CustomProps) => {
  const { control, name } = props;
  // console.log('control', control);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex-1">
          {/* {props.fieldType !== FormFieldType.CHECKBOX && label && (
            <FormLabel className="font-14-20-400">
              {label}
              {isAstrikRequired && <span className="text-red-500">*</span>}
            </FormLabel>
          )} */}

          <RenderInput field={field} props={props} />

          {/* <FormMessage className="shad-error" /> */}
        </FormItem>
      )}
    />
  );
};

export default CustomFormField;
