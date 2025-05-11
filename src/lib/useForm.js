import { useState } from 'react';

export const useForm = (initialState = {}) => {
  const [formValues, setFormValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when the user changes it
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = (validationSchema) => {
    const newErrors = {};
    let isValid = true;

    Object.entries(validationSchema).forEach(([fieldName, rules]) => {
      const value = formValues[fieldName];
      
      if (rules.required && (!value || value.trim() === '')) {
        newErrors[fieldName] = `${rules.label || fieldName} is required`;
        isValid = false;
      } else if (rules.pattern && !rules.pattern.test(value)) {
        newErrors[fieldName] = rules.message || `${rules.label || fieldName} is invalid`;
        isValid = false;
      } else if (rules.validate && !rules.validate(value, formValues)) {
        newErrors[fieldName] = rules.message || `${rules.label || fieldName} is invalid`;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  return {
    formValues,
    errors,
    isSubmitting,
    setIsSubmitting,
    handleChange,
    setFormValues,
    validate,
    reset: () => setFormValues(initialState),
  };
};
