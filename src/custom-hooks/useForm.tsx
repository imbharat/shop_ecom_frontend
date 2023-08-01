import { postFormData, updateById } from "@/services/shared.service";
import React, { useState } from "react";

export function useForm<T>(initialFieldValues: T, submitUrl: string) {
  const [id, setId] = useState(0);
  const [isEdit, setIsEdit] = useState(false);
  const [values, setValues] = useState<T>(initialFieldValues);
  const [errors, setErrors] = useState<any>({});
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const setValueExplicitly = (fieldName: string, value: any) => {
    setValues({
      ...values,
      [fieldName]: value,
    });
  };

  const updateFullForm = (formValues: T) => {
    setValues(formValues);
  };

  const resetForm = () => {
    setValues(initialFieldValues);
    setErrors({});
  };

  const submitForm = async (
    e: SubmitEvent,
    callback: (isSuccess: boolean) => void
  ) => {
    e.preventDefault();
    if (isEdit) {
      const response = await updateById(id, values as Object, submitUrl);
      callback(response?.data);
    } else {
      const response = await postFormData(values, submitUrl);
      callback(response?.data);
    }
  };

  return {
    values,
    errors,
    setErrors,
    setValueExplicitly,
    handleInputChange,
    resetForm,
    setId,
    setIsEdit,
    updateFullForm,
    submitForm,
  };
}

export function Form(props: any) {
  const { children, ...other } = props;
  return <form {...other}>{props.children}</form>;
}
