import Ajv from "ajv";
import { CodeUsageSchema } from "./schemas/codeUsage";

const ajv = new Ajv();
const validate = ajv.compile(CodeUsageSchema);

export function validateCodeUsage(data: unknown) {
  const isValid = validate(data);

  if (!isValid) {
    return {
      success: false,
      errors: validate.errors,
    };
  }

  return {
    success: true,
    data,
  };
}