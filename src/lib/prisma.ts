 import { PrismaClient } from '@/generated/prisma/client'

import { PrismaPg } from '@prisma/adapter-pg'

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined")
}

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
})

const createPrismaClient = () => {
    return new PrismaClient({ adapter })
}

declare global {
    var prismaGlobal: ReturnType<typeof createPrismaClient> | undefined
}

const prisma = global.prismaGlobal ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
    global.prismaGlobal = prisma
}

export default prisma
