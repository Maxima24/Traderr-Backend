import express ,{Application} from "express"
import cors from "cors"
import morgan from "morgan"
import dotenv  from "dotenv"
import { env } from "./config/env"
import authRoutes from "./routes/index"
    export class Server{
        private app:Application
        private port:number
        private env: typeof env
        constructor(){
            dotenv.config()
            this.app = express()
            this.port = parseInt(env.PORT ||"8000",10)
            this.env = env
            this.initializeMiddleWares()
            this.intializeRoutes()
            this.initializeErrorHandling()

            
            
        }
        /**Initalize MiddleWares */
        private initializeMiddleWares():void{
            this.app.use(cors())
            this.app.use(morgan("dev"))
            this.app.use(express.json())
            this.app.use(express.urlencoded({extended:true} ))

        }
        private intializeRoutes():void{
            this.app.get("/api/user",(req,res,next)=>{
                res.json({
                    message:"APi is running"
                })
            })
            this.app.use("/api/auth/",authRoutes)
        }
        private initializeErrorHandling():void{
            this.app.use((err:any,req:any,res:any,next:any)=>{
                console.error(err.stack)
                res.status(500).json({
                    message:"something went wrong"
                })
            })
        }
        public listen():void{
            this.app.listen(this.port,()=>{
                 console.log(`Server listening on ${this.port}`)
            })
        }
        public getApp():Application{
            return this.app
        }
    }