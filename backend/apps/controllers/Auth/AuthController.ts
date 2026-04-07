import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { AuthRequest } from "../../middleware/authMiddleware";
import { AuthService } from "../../Services/AuthService";
import { validateLogin, validateRegister } from "../../validators/authValidators";
import { sendSuccess } from "../../utils/response";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password } = validateRegister(req.body);
    const result = await this.authService.register(name, email, password);

    return sendSuccess(
      res,
      {
        user: { 
          id: result.user._id, 
          name: result.user.name, 
          email: result.user.email, 
          role: result.user.role,
          level: (result.user as any).level,
          targetLevel: (result.user as any).targetLevel,
          learningGoal: (result.user as any).learningGoal,
          points: (result.user as any).points || 0,
          totalTopicsLearned: (result.user as any).totalTopicsLearned || 0
        },
        token: result.token
      },
      201
    );
  }) as any;

  login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = validateLogin(req.body);
    const result = await this.authService.login(email, password);

    return sendSuccess(res, {
      user: { 
        id: result.user._id, 
        name: result.user.name, 
        email: result.user.email, 
        role: result.user.role,
        level: (result.user as any).level,
        targetLevel: (result.user as any).targetLevel,
        learningGoal: (result.user as any).learningGoal,
        points: (result.user as any).points || 0,
        totalTopicsLearned: (result.user as any).totalTopicsLearned || 0,
        avatarUrl: (result.user as any).avatarUrl,
        phone: (result.user as any).phone,
        bio: (result.user as any).bio,
        dateOfBirth: (result.user as any).dateOfBirth,
        gender: (result.user as any).gender,
        createdAt: result.user.createdAt,
        address: (result.user as any).address
      },
      token: result.token
    });
  }) as any;

  updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const user = await this.authService.updateProfile(userId, req.body);
    return sendSuccess(res, user);
  }) as any;

  changePassword = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const { oldPassword, newPassword } = req.body;
    await this.authService.changePassword(userId, oldPassword, newPassword);
    return sendSuccess(res, null, 200, "Đổi mật khẩu thành công");
  }) as any;
}
