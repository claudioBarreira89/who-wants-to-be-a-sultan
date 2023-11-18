import { Form as AntdForm } from 'antd';
import type React from 'react';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import { useController } from 'react-hook-form';

type AntdFormInputProps = React.ComponentProps<typeof AntdForm.Item>;

export type FormInputProps<TFieldValues extends FieldValues = FieldValues> = {
  children: React.ReactNode;
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
} & Omit<AntdFormInputProps, 'name' | 'normalize' | 'rules' | 'validateStatus'>;

export const FormInput = <TFieldValues extends FieldValues = FieldValues>({
  children,
  control,
  name,
  help,
  ...props
}: FormInputProps<TFieldValues>) => {
  const { field, fieldState } = useController({ name, control });
  const handleNormalize: AntdFormInputProps['normalize'] = (value) => {
    field.onChange(value);
    return value;
  };

  return (
    <AntdForm.Item
      {...props}
      initialValue={field.value}
      normalize={handleNormalize}
      validateStatus={fieldState.invalid ? 'error' : undefined}
      help={fieldState.error?.message ?? help}
    >
      {children}
    </AntdForm.Item>
  );
};