import { PrismaClient } from '@prisma/client'
import { Bot, createBotCommand } from '@twurple/easy-bot';
import { authProvider } from '../auth.js';

const prisma = new PrismaClient()

export const bot = new Bot({
    authProvider,
    channels: ['voiceunmuted',],
    commands: []
});

bot.onSub(async ({ broadcasterName, userName, isPrime, plan, planName, wasGift }) => {
    if (!isPrime && !wasGift) {
        upsertSubValue(userName, broadcasterName, plan)
    }
});
bot.onResub(async ({ broadcasterName, userName, isPrime, plan, planName, wasGift }) => {
    if (!isPrime && !wasGift) {
        upsertSubValue(userName, broadcasterName, plan)
    }
});

bot.onConnect(() => {
    console.log("Connected")
})


async function upsertSubValue(username, channel, tier) {
    const date = new Date()

    await prisma.sub.upsert({
        where: {
            username_channel_month_year: {
                username: username,
                channel: channel,
                month: date.getMonth() + 1,
                year: date.getFullYear(),
            }
        },
        update: {
            tier: tier / 1000
        },
        create: {
            username: username,
            channel: channel,
            month: date.getMonth() + 1,
            year: date.getFullYear(),
            tier: tier / 1000,
        },
    })
}