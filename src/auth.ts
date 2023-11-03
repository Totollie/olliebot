import axios from "axios";
import dotenv from "dotenv";
import qs from "qs";
dotenv.config();


export class Config {
  constructor(
    public twitchClientId?: string,
    public twitchClientSecret?: string,
    public twitchClientToken?: string,
    public twitchClientExpiry?: Date,
  ) {}
}

const TWITCH_API = "https://id.twitch.tv/oauth2/token";
export const config: Config = new Config(process.env.TWITCH_CLIENT_ID, process.env.TWITCH_CLIENT_SECRET);

export async function validateTwitchToken() {
  if (config.twitchClientId === undefined || config.twitchClientSecret === undefined || config.twitchClientToken === undefined || config.twitchClientExpiry === undefined) {
    return false;
  }

  const currentDate = new Date();

  if (currentDate >= config.twitchClientExpiry) {
    return false;
  }

  return true;
}

export async function renewTwitchToken() {
  const authParams = qs.stringify({
    client_id: config.twitchClientId,
    client_secret: config.twitchClientSecret,
    grant_type: "client_credentials",
    scope: "channel:moderate chat:edit chat:read",
  });

  await axios.post(`${TWITCH_API}?${authParams}`).then(res => {
    config.twitchClientToken = res.data.access_token;
    const expiryDate = new Date();
    expiryDate.setSeconds(expiryDate.getSeconds() + res.data.expires_in);
    config.twitchClientExpiry = expiryDate;
  });
}
