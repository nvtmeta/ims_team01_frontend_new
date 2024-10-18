import messages from "@/messages/messages";

export const validateForm = (fields: { [key: string]: any }) => {
  const errors: { [key: string]: string } = {};
  Object.keys(fields).forEach((fieldName) => {
    if (!fields[fieldName]) {
      errors[fieldName] = messages.ME002; // or a generic error message
    }
  });
  return errors;
};
