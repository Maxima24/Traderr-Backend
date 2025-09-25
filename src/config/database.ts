import {prisma} from "./prisma"
export class DataBase{
    static getClient(){
        return prisma
    }
}