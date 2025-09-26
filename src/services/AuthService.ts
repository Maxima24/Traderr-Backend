import bcrypt from "bcrypt"
import { verifyMessage } from "ethers";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
export class AuthService{
    private JwtSecret:string   
    constructor(){
        this.JwtSecret = env.JWT_SECRET 
    }
    public async hashPassword(password:string){
        return bcrypt.hash(password,12)
    }
    public async verifyPassword(password:string,hash:string){
        return bcrypt.compare(password,hash)
    }
    public generateToken(payload:object){
        return jwt.sign(payload,this.JwtSecret,{expiresIn:"1d"})
    }

    // Web 3 Login Functions
   public async verifyWalletSignature(walletAddress:string,nonce:string,signature:string){
    const recoverdAddress  = verifyMessage(nonce,signature)
    return recoverdAddress.toLowerCase() === walletAddress.toLowerCase()
   }
}