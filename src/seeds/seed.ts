import { PrismaClient } from "@prisma/client";
import * as fs from "fs"

const prisma = new PrismaClient()

async function main() {
    const users = JSON.parse(fs.readFileSync('./seeds/users.json', 'utf-8'))
    const products = JSON.parse(fs.readFileSync('./seeds/products.json', 'utf-8'))
    const transactions = JSON.parse(fs.readFileSync('./seeds/transactions.json', 'utf-8'))
    const transactionItems = JSON.parse(fs.readFileSync('./seeds/transactionItems.json', 'utf-8'))

    for (const user of users) {
        await prisma.user.create({ data: user })
    }

    for (const product of products) {
        await prisma.product.create({ data: product })
    }

    for (const transaction of transactions) {
        await prisma.transaction.create({ data: transaction })
    }

    for (const transactionItem of transactionItems) {
        await prisma.transactionItem.create({ data: transactionItem })
    }
}

main().then(async () => {
    console.log('Seeding success ...')
    await prisma.$disconnect()
}).catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit
})