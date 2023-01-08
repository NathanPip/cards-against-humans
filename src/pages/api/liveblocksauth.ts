import { authorize } from "@liveblocks/node";
import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "../../env/server.mjs";
import {prisma} from "../../server/db/client";
import { ObjectId } from "bson";

const liveblocksauth = async (req: NextApiRequest, res: NextApiResponse) => {

  
  const room = req.body.room;
  const userId = prisma.lobby.findUnique({
    where: {
      id: room
    },
    select: {
      userId: true
    }
  });
  const result = await authorize({
    room,
    secret: env.LIVEBLOCKS_SECRET_KEY,
    userId: new ObjectId().toString(), // Optional
  });
  return res.status(result.status).end(result.body);
}

export default liveblocksauth;