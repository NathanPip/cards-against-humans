import { createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";


const client = createClient({
    publicApiKey: "pk_dev_QITbJuUdEm4yTqHo3K0X8C9wj_zUhT6zde13RVdNBg9GI2iYSgfQPpQnDhpNgD44"
})

export const {suspense: {RoomProvider, useOthers, useUpdateMyPresence}} = createRoomContext(client);