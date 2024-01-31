import { StaticAuthProvider } from "@twurple/auth";
import * as dotenv from "dotenv";

dotenv.config();

const clientId = process.env.CLIENT_ID;
const accessToken = process.env.ACCESS_TOKEN

export const authProvider = new StaticAuthProvider(
    clientId,
    accessToken,
    ['chat:read', 'chat:edit', 'channel:moderate', 'channel:read:subscriptions', 'channel:read:redemptions', 'moderator:manage:banned_users']
);