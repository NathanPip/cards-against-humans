export const red = 5;
// import { type NextApiRequest, type NextApiResponse } from "next";
// import fs from "fs";
// import { v4 as uuid } from "uuid";

// import { prisma } from "../../server/db/client";

// type Card = {
//   text: string;
//   pack: number;
// };

// type CardPack = {
//   name: string;
//   white: Card[];
//   black: Card[];
//   official: boolean;
// };

// const examples = async (req: NextApiRequest, res: NextApiResponse) => {
//   try {
//     const rawdata = fs.readFileSync(
//       "G:/Codes/partypack/public/cah-cards-full.json",
//       "utf-8"
//     );
//     const cardPacks = JSON.parse(rawdata) as CardPack[];
//     for (let i = 35; i < cardPacks.length; i++) {
//       if(!cardPacks[i]) continue;
//       const id = uuid();
//       await prisma.cAHPack.create({
//         data: {
//           id,
//           name: cardPacks[i]!.name,
//           official: cardPacks[i]!.official,
//         },
//       });
//       for (const card of cardPacks[i]!.white) {
//         await prisma.cAHWhiteCard.create({
//           data: {
//             text: card.text,
//             packId: id,
//           },
//         });
//       }
//       for (const card of cardPacks[i]!.black) {
//         await prisma.cAHBlackCard.create({
//           data: {
//             text: card.text,
//             packId: id,
//           },
//         });
//       }
//     }
//     res.status(200).json({ message: "Success" });
//   } catch (err) {
//     res.status(500).json(err);
//   }
// };

// export default examples;
