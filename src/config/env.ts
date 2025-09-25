import dotenv from "dotenv";
import path from "path";
import { z } from "zod";
dotenv.config({ path:path.resolve(process.cwd(),".env") });
const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.string().default("8000"),
  DATABASE_URL: z.string(),
DIRECT_URL:z.string()

});
const parsedEnv = envSchema.safeParse(process.env)
if(!parsedEnv.success){
    console.error("❌ Invalid environment variables:", parsedEnv.error.flatten().fieldErrors);
    process.exit(1);
}
export const env = parsedEnv.data