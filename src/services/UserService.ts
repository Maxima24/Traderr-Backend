import { PrismaClient } from "@prisma/client";
import { DataBase } from "../config/database";
import { AuthService } from "./AuthService";

export class UserService {
  private db: PrismaClient;
  private authService: AuthService;

  constructor() {
    this.db = DataBase.getClient();
    this.authService = new AuthService();
  }

  // =====================
  // Register new user
  // =====================
  public async register(data: { user_name: string; email: string; password: string }) {
    const { user_name, email, password } = data;

    if (!email || !password || !user_name) {
      throw new Error("Email and password and user_name are required");
    }

    const hashedPassword = await this.authService.hashPassword(password);

    const user = await this.db.user.create({
      data: {
        user_name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        user_name: true,
        email: true,
        role: true,
        avatarUrl: true,
        walletAddress: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const token = this.authService.generateToken({
      sub: user.id,
      type: "web2",
    });

    return {
      message: "User registered successfully",
      data: { user, token },
    };
  }

  // =====================
  // Login user
  // =====================
  public async login(data: { email: string; password: string }) {
    const { email, password } = data;

    const user = await this.db.user.findUnique({
      where: { email },
      select: {
        id: true,
        user_name: true,
        email: true,
        password: true, // needed to verify password
        role: true,
        avatarUrl: true,
        walletAddress: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return { message: "User not found", data: {} };
    }

    const correctPassword = await this.authService.verifyPassword(password, user?.password!);
    if (!correctPassword) {
      return { message: "Password is incorrect", data: {} };
    }

    // remove password from user object before returning
    const { password: _, ...safeUser } = user;

    const token = this.authService.generateToken({
      sub: user.id,
      type: "web2",
    });

    return {
      message: "Login successful",
      data: { user: safeUser, token },
    };
  }

  // =====================
  // Web3 user creation
  // =====================
  public async createUserWithWallet(walletAddress: string) {
    const nonce = Math.floor(Math.random() * 1_000_000).toString();

    const user = await this.db.user.upsert({
      where: { walletAddress },
      create: { walletAddress, nonce },
      update: { nonce },
    });

    return user;
  }

  public async getUserByWallet(walletAddress: string) {
    return this.db.user.findUnique({ where: { walletAddress } });
  }

  public async updateNonce(userId: string, nonce: string | null) {
    if (!userId || !nonce) {
      console.error("User or nonce not found");
      return null;
    }
    return this.db.user.update({
      where: { id: userId },
      data: { nonce },
    });
  }

  public async loginWithWallet(walletAddress: string, signature: string) {
    const user = await this.getUserByWallet(walletAddress);
    if (!user || !user.nonce) throw new Error("User or nonce not found");

    const isValid = await this.authService.verifyWalletSignature(walletAddress, user.nonce, signature);
    if (!isValid) throw new Error("Invalid signature");

    await this.updateNonce(user.id, null);

    return user;
  }
}
