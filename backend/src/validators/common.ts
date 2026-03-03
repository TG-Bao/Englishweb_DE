import { AppError } from "../utils/AppError";

const isNil = (value: unknown) => value === undefined || value === null;

export const requireString = (value: unknown, field: string): string => {
  if (isNil(value) || typeof value !== "string" || value.trim() === "") {
    throw new AppError(`${field} is required`, 400);
  }
  return value.trim();
};

export const optionalString = (value: unknown): string | undefined => {
  if (isNil(value)) return undefined;
  if (typeof value !== "string") throw new AppError("invalid string", 400);
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
};

export const requireNumber = (value: unknown, field: string): number => {
  if (isNil(value)) throw new AppError(`${field} is required`, 400);
  const num = typeof value === "number" ? value : Number(value);
  if (Number.isNaN(num)) throw new AppError(`${field} must be a number`, 400);
  return num;
};

export const optionalNumber = (value: unknown): number | undefined => {
  if (isNil(value)) return undefined;
  const num = typeof value === "number" ? value : Number(value);
  if (Number.isNaN(num)) throw new AppError("invalid number", 400);
  return num;
};

export const optionalBoolean = (value: unknown): boolean | undefined => {
  if (isNil(value)) return undefined;
  if (typeof value === "boolean") return value;
  if (value === "true") return true;
  if (value === "false") return false;
  throw new AppError("invalid boolean", 400);
};

export const requireArray = <T>(value: unknown, field: string): T[] => {
  if (!Array.isArray(value)) throw new AppError(`${field} is required`, 400);
  return value as T[];
};

export const optionalArray = <T>(value: unknown): T[] | undefined => {
  if (isNil(value)) return undefined;
  if (!Array.isArray(value)) throw new AppError("invalid array", 400);
  return value as T[];
};
