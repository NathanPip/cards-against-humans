import { LiveObject } from "@liveblocks/client";
import { type inferRouterOutputs } from "@trpc/server";
import { useContext, useRef, useState } from "react";
import { z } from "zod";
import { useMutation as liveblocksMutation } from "../../../liveblocks.config";
import { LobbyContext } from "../../../pages/lobby/[id]";
import { type AppRouter } from "../../../server/trpc/router/_app";
import { type CAHGameOptions } from "../../../types/game";
import { trpc } from "../../../utils/trpc";
import StartGameButton from "./StartGameButton";

type CAHOptionsProps = {
  data: inferRouterOutputs<AppRouter>["game"]["getBasicGameInfo"];
};

const CardDataType = z.object({
  id: z.string().cuid(),
  text: z.string(),
});

const FormOptionsInputsParser = z.object({
  pointsToWin: z.number().min(1).max(100),
  whiteCardsPerPlayer: z.number().min(1).max(25),
  whiteCards: z.array(CardDataType),
  blackCards: z.array(CardDataType),
});

const ConnectedPlayersParser = z.string().array().nonempty();

const CAHOptions: React.FC<CAHOptionsProps> = ({ data }) => {
  const pointsToWinInput = useRef<HTMLInputElement>(null);
  const cardsPerPlayerInput = useRef<HTMLInputElement>(null);
  const cardPacksSelect = useRef<HTMLFieldSetElement>(null);
  const trpcContext = trpc.useContext();
  const lobby = useContext(LobbyContext);
  const cardPacks = data.cardPacks.sort((a,b) => {
    if(a.name === "CAH Base Set") return -1;
    if(b.name === "CAH Base Set") return 1;
    return 0;
  })

  const [error, setError] = useState<string | null>(null);

  const setOptions = liveblocksMutation(
    ({ storage, self, others }, options, players: string[]) => {
      ///////////////////////////
      //ERROR NEEDS TO BE SET WITH TRY CATCH
      ///////////////////////////
      const parsedOptions = FormOptionsInputsParser.parse(options);
      const obj: CAHGameOptions = new LiveObject({
        pointsToWin: parsedOptions.pointsToWin,
        whiteCardsPerPlayer: parsedOptions.whiteCardsPerPlayer,
      });
      const parsedPlayers = ConnectedPlayersParser.parse(players);
      const currentBlackCard =
        parsedOptions.blackCards[parsedOptions.blackCards.length - 1];
      if (!currentBlackCard) throw new Error("No black cards found");
      const myId = self.id;
      storage.get("CAH").set("currentHost", myId);
      storage.get("CAH").set("options", obj);
      storage.get("CAH").set("whiteCards", parsedOptions.whiteCards);
      storage.get("CAH").set("blackCards", parsedOptions.blackCards);
      storage.get("CAH").set("connectedPlayers", parsedPlayers);
      storage
        .get("CAH")
        .set("currentWhiteCardIndex", parsedOptions.whiteCards.length);
      storage.get("CAH").set("currentBlackCard", currentBlackCard);
      storage.get("CAH").set("currentPlayerDrawing", parsedPlayers[0]);
      storage
        .get("CAH")
        .set(
          "currentPlayerTurn",
          parsedPlayers[Math.floor(Math.random() * parsedPlayers.length)]
        );
      storage.get("CAH").set("activeState", "starting game");
      storage.get("CAH").set("handsRevealed", 0);
    },
    []
  );

  const setisPlaying = liveblocksMutation(({ storage }) => {
    console.log("ran");
    storage.set("currentGame", "Cards Against Humanity");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const pointsToWin = pointsToWinInput.current?.value;
      const cardsPerPlayer = cardsPerPlayerInput.current?.value;
      const cardPacksElements = cardPacksSelect.current;
      if (!cardPacksElements) return;
      if (!lobby) throw new Error("No lobby found");

      const cardPacks = Array.from(cardPacksElements.elements)
        .map((e) => e as HTMLInputElement)
        .filter((e: HTMLInputElement) => e.checked)
        .map((e: HTMLInputElement) => e.value);

      ///////////////////////////
      //ERROR NEEDS TO BE SET WITH TRY CATCH
      ///////////////////////////
      const packData = await trpcContext.game.getSelectedCardPacks.fetch(
        cardPacks
      );
      ///////////////////////////
      //ERROR NEEDS TO BE SET WITH TRY CATCH
      ///////////////////////////
      const playerData = (
        await trpcContext.lobby.getConnectedPlayers.fetch(lobby.id)
      ).map((player) => player.id);
      if (!packData) throw new Error("No card packs found");
      const whiteCards: z.infer<typeof CardDataType>[] = [];
      const blackCards: z.infer<typeof CardDataType>[] = [];
      packData.cardPacks.forEach((pack) => {
        whiteCards.push(...pack.whiteCards);
        blackCards.push(...pack.blackCards);
      });
      whiteCards.sort(() => Math.random() - 0.5);
      blackCards.sort(() => Math.random() - 0.5);
      const gameOptions = {
        pointsToWin: pointsToWin ? parseInt(pointsToWin) : 10,
        whiteCardsPerPlayer: cardsPerPlayer ? parseInt(cardsPerPlayer) : 10,
        whiteCards,
        blackCards,
        currentCard: whiteCards.length - 1,
      };

      setOptions(gameOptions, playerData);
      setisPlaying();
    } catch (e) {
      if (e instanceof z.ZodError || e instanceof Error) setError(e.message);
      console.log(e);
    }
  };

  // ERROR STATES NEED TO BE SET
  return (
    <div className="flex justify-center">
      <div className="mb-8 flex max-w-lg justify-center shadow-inset">
        <form onSubmit={handleSubmit} className="flex flex-col  items-center">
          <div className="flex  h-full  items-center  ">
            <div className="flex w-48 flex-col items-center">
              <label className="mt-4 text-lg" htmlFor="points-to-win">
                Score To Win
              </label>
              <input
                className="mt-2 w-12 rounded-xl border-2 border-black/10 bg-zinc-500/40 text-white"
                type="text"
                defaultValue={10}
                id="points-to-win"
                ref={pointsToWinInput}
              />
            </div>
            <div className="ml-24 flex flex-col items-center">
              <label className="mt-4 text-lg" htmlFor="cards-per-player">
                White Cards Per Player
              </label>
              <input
                className="mt-2 w-12 rounded-xl border-2 border-black/10 bg-zinc-500/40 text-white"
                type="text"
                defaultValue={10}
                id="cards-per-player"
                ref={cardsPerPlayerInput}
              />
            </div>
          </div>
          <label className="max-w-1/5 mt-4 mb-4 text-lg font-semibold drop-shadow-xl" htmlFor="packs">
            Card Packs
          </label>
          <div className="flex content-center p-4 ">
            <fieldset
              name="packs"
              ref={cardPacksSelect}
              className="max-h-60 flex-col overflow-y-hidden shadow-inset relative"
            >
                <ul id="packs" className="flex flex-col gap-4 overflow-y-scroll py-3 h-full">
                  {cardPacks.map((pack, index) => (
                    <li className="flex items-center" key={pack.id}>
                      <label className="font-semibold drop-shadow-sm ml-2 mr-auto" htmlFor={pack.name} key={pack.id + "label"}>
                        {pack.name}
                      </label>
                        <p className="mx-1 py-1 px-2 rounded-md text-sm bg-white text-black font-semibold">{pack._count.whiteCards}</p>
                        <p className="mx-1 py-1 px-2 rounded-md text-sm bg-black text-white font-semibold mr-4">{pack._count.blackCards}</p>
                        <input
                          className="card_pack_checkbox"
                          type="checkbox"
                          key={pack.id}
                          name={pack.name}
                          value={pack.id}
                          checked={index === 0 ? true : undefined}
                        />
                    </li>
                  ))}
                </ul>
            </fieldset>
          </div>

          <StartGameButton />
        </form>
      </div>
    </div>
  );
};

export default CAHOptions;
