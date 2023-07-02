import { postFormData } from "@/services/shared.service";
import axios from "axios";
import React, { useState } from "react";

export function useForm<T>(initialFieldValues: T, submitUrl: string) {
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

  const resetForm = () => {
    setValues(initialFieldValues);
    setErrors({});
  };

  const submitForm = async (
    e: SubmitEvent,
    callback: (isSuccess: boolean) => void
  ) => {
    e.preventDefault();
    const response = await postFormData(values, submitUrl);
    callback(response?.data);
  };

  return {
    values,
    errors,
    setErrors,
    setValueExplicitly,
    handleInputChange,
    resetForm,
    submitForm,
  };
}

export function Form(props: any) {
  const { children, ...other } = props;
  return <form {...other}>{props.children}</form>;
}
