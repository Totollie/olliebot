import { PrismaClient } from '@prisma/client'
import Express from 'express';
import * as dotenv from "dotenv";

import { bot } from './twurple/bot.js';
// import { client as pubsubClient } from './twurple/pubsub.js';

dotenv.config();
const prisma = new PrismaClient()

const app = Express();
app.disable('etag');
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`App listening on port ${port}!`);
});

app.get('/partnerplus/:channel/', async (req, res) => {
    const date = new Date()

    const t1 = await prisma.Sub.count({
        where: {AND: [
            {channel: {equals: req.params.channel}},
            {year: {equals: date.getFullYear()}},
            {month: {equals: date.getMonth() + 1}},
            {tier: {equals: 1}},
        ]},
    })
    const t2 = await prisma.Sub.count({
        where: {AND: [
            {channel: {equals: req.params.channel}},
            {year: {equals: date.getFullYear()}},
            {month: {equals: date.getMonth() + 1}},
            {tier: {equals: 2}},
        ]},
    })
    const t3 = await prisma.Sub.count({
        where: {AND: [
            {channel: {equals: req.params.channel}},
            {year: {equals: date.getFullYear()}},
            {month: {equals: date.getMonth() + 1}},
            {tier: {equals: 3}},
        ]},
    })

    const subScore = t1 + (t2 * 2) + (t3 * 6)

    const resCss = 'text-align:center;height:100%;display:flex;justify-content:center;align-items:center;font-size:25em;'
    res.send(`
        <html>
            <head>
                <meta http-equiv='refresh' content='30' />
            </head>
            <body>
                <div class='sub-score label' style='${resCss}'>
                    ${subScore}
                </div>
            </body>
        </html>`
    )
})