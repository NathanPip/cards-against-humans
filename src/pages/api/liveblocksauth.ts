import { authorize } from "@liveblocks/node";
import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "../../env/server.mjs";
import {v4 as uuid} from "uuid";

const liveblocksauth = async (req: NextApiRequest, res: NextApiResponse) => {

  const room = req.body.room;
  const result = await authorize({
    room,
    secret: env.LIVEBLOCKS_SECRET_KEY,
    userId: uuid(), // Optional
  });
  return res.status(result.status).end(result.body);
}

export default liveblocksauth;