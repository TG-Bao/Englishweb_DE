import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { IAuthService } from "../interfaces/services/AuthService";
import { validateLogin, validateRegister } from "../validators/authValidators";
import { sendSuccess } from "../utils/response";

export class AuthController {
  constructor(private authService: IAuthService) {}

  register = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password } = validateRegister(req.body);
    const result = await this.authService.register(name, email, password);

    return sendSuccess(
      res,
      {
        user: { id: result.user._id, name: result.user.name, email: result.user.email, role: result.user.role },
        token: result.token
      },
      201
    );
  });

  login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = validateLogin(req.body);
    const result = await this.authService.login(email, password);

    return sendSuccess(res, {
      user: { id: result.user._id, name: result.user.name, email: result.user.email, role: result.user.role },
      token: result.token
    });
  });
}
