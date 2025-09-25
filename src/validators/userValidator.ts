import {z} from "zod"
 export const userCreateValidator = z.object({
    email: z.string(),
    user_name:z.string(),
    password:z.string()

})
export const userLoginValidator = z.object({
    email:z.string(),
    password:z.string()
})
export const userLoginWithWalletValidator =z.object({
    walletAddress:z.string(),
    signature:z.string()
})
export const walletSignUpValidator = z.object({
    walletAddress: z.string()
})