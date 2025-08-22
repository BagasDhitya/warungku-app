import { PrismaClient } from '@prisma/client'
export class UserService {
    private prisma: PrismaClient

    constructor() {
        this.prisma = new PrismaClient()
    }

    public getAll() {
        const result = this.prisma.user.findMany()
        return result
    }

    public getById(id: number) {
        const result = this.prisma.user.findUnique({
            where: {
                id_user: Number(id)
            }
        })
        return result
    }

    public create(username: string, email: string, password: string) {
        const result = this.prisma.user.create({
            data: {
                username, email, password
            }
        })
        return result
    }
}