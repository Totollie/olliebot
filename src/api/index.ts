import express from "express";

import MessageResponse from "../interfaces/MessageResponse";
import twitch from "./twitch";

const router = express.Router();

router.get<{}, MessageResponse>("/", (req, res) => {
  res.json({
    message: "👋",
  });
});

router.use("/twitch", twitch);

export default router;
