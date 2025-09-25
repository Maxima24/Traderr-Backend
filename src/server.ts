import express ,{Application} from "express"
import cors from "cors"
import morgan from "morgan"
import dotenv  from "dotenv"
    export class Server{
        private app:Application
        private port:number
        constructor(){
            dotenv.config()
            this.app = express()
            this.port = parseInt(process.env.PORT ||"8000",10)
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