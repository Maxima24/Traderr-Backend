import {Router,Request,Response,NextFunction} from "express"
// import UserSeri
import { userCreateValidator,userLoginValidator, userLoginWithWalletValidator, walletSignUpValidator } from "../validators/userValidator"
import { UserService } from "../services/userService"
import { AuthService } from "../services/authService"
 export class UserController{
    private userService:UserService
    private authService:AuthService
    public router:Router
        constructor(){
            this.userService = new UserService()
            this.authService = new AuthService()
            this.router = Router()
            this.initializeRoute()
        }

        /** Route initialization */
        private initializeRoute(){
            this.router.post("/register",this.CreateUser)
            this.router.post("/login",this.loginUser)
            this.router.post("loginWithWallet",this.loginWithWallet)
            this.router.post("/wallet-signup",this.signUpWithWallet)
        }
    /**Web 2 function calls */
    public CreateUser=  async(req:Request,res:Response,next:NextFunction)=>{
        try{
           const parsedData = userCreateValidator.parse(req.body)
           if (!parsedData) throw new Error("Validation Failed")
           const user = await this.userService.register(parsedData)

           return res.status(201).json({
            message:"User created Successfully",
            data:{
                user
            }
           })
        }catch(err){
            next(err)
        }
    }

    public loginUser = async(req:Request,res:Response,next:NextFunction)=>{
        try{
            const data = userLoginValidator.parse(req.body)
            const user =  await this.userService.login(data)
           return res.status(201).json({
            Message:"login successful",
            data:{
                user
            }
           })
        }catch(err){
            next(err)
        }
       
    }
   /**WEB 3 function calls */
    public signUpWithWallet = async(req:Request,res:Response,next:NextFunction ) =>{
        try{
            const {walletAddress} = walletSignUpValidator.parse(req.body)
            const user = await this.userService.createUserWithWallet(walletAddress)
                res.status(201).json({
                    message:"Wallet Signup was Successful!!",
                    data:{
                        walletAddress: user.walletAddress,
                        nonce: user.nonce,
                    }
                })
        }catch(err){
            next(err)
        }
    }




    public loginWithWallet = async(req:Request,res:Response,next:NextFunction)=>{
        try{
            const {walletAddress,signature} =userLoginWithWalletValidator.parse(req.body)
            const user = await this.userService.loginWithWallet(walletAddress,signature)
            const token = this.authService.generateToken({
                sub: user.id,
                walletAddress,
                type: "web3",
            })
            res.status(201).json({
                message:"Login successful",
                token
            })
        }catch(err){
            next(err)
        }
    }
}