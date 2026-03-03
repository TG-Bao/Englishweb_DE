import { LoginDto, RegisterDto } from "../dtos/authDtos";
import { requireString } from "./common";

export const validateRegister = (payload: any): RegisterDto => {
  return {
    name: requireString(payload?.name, "name"),
    email: requireString(payload?.email, "email"),
    password: requireString(payload?.password, "password")
  };
};

export const validateLogin = (payload: any): LoginDto => {
  return {
    email: requireString(payload?.email, "email"),
    password: requireString(payload?.password, "password")
  };
};
