export class RegisterDto {
  name!: string;
  email!: string;
  password!: string;
  constructor() {}
}

export class LoginDto {
  email!: string;
  password!: string;
  constructor() {}
}
