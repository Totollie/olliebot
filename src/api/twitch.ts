import express from "express";
import { config, renewTwitchToken, validateTwitchToken } from "../auth";
import axios from "axios";
import qs from "qs";

const TWITCH_HELIX_USER_API = "https://api.twitch.tv/helix/users";

const router = express.Router();

// Fetch a users description
router.get<{}, {}>("/bio", async (req, res) => {
  if (!req.query.username) {
    res
      .status(404)
      .json({ error: "username not specified as query parameter." });
  }

  if (!(await validateTwitchToken())) {
    console.log("Twitch token expired. Renewing...");
    await renewTwitchToken();
  }

  const username = req.query.username;
  console.log(`Fetching bio for ${username}`);

  const authParams = qs.stringify({ login: username });
  const reqConfig = {
    "headers": {
      "Authorization": `Bearer ${config.twitchClientToken}`,
      "Client-Id": config.twitchClientId,
    },
  };

  const bio = await axios
    .get(`${TWITCH_HELIX_USER_API}?${authParams}`, reqConfig)
    .then((user_res) => {
      const data = user_res.data.data;

      if (data.length < 0) {
        throw Error("No results found for this username");
      }

      console.log(data);
      let description = data[0].description;

      if (description === "") {
        description = "They're awesome!";
      }

      return description;
    })
    .catch(() => {
      res.status(404).send("Unknown user");
    });

  res.send(bio);
});

export default router;
