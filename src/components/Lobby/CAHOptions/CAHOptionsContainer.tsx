import { LiveObject } from "@liveblocks/client";
import { type inferRouterOutputs } from "@trpc/server";
import { createRef, useContext, useState } from "react";
import { z } from "zod";
import { useBroadcastEvent, useMutation as liveblocksMutation } from "../../../liveblocks.config";
import { LobbyContext } from "../../../pages/lobby/[id]";
import { type AppRouter } from "../../../server/trpc/router/_app";
import { type CAHGameOptions } from "../../../types/game";
import { trpc } from "../../../utils/trpc";
import GameSettings from "./GameSettings";
import PacksList from "./PacksList";
import StartGameButton from "./StartGameButton";

type CAHOptionsProps = {
  data: inferRouterOutputs<AppRouter>["game"]["getBasicGameInfo"];
};

const CardDataType = z.object({
  id: z.string(),
  text: z.string(),
});

const FormOptionsInputsParser = z.object({
  pointsToWin: z.number().min(1).max(100),
  whiteCardsPerPlayer: z.number().min(1).max(25),
  cardPacks: z.string().array().nonempty(),
  currentWhiteCard: z.number().min(1),
});

const ConnectedPlayersParser = z.string().array().nonempty();

const CAHOptions: React.FC<CAHOptionsProps> = ({ data }) => {
  const pointsToWinInput = createRef<HTMLSelectElement>();
  const cardsPerPlayerInput = createRef<HTMLSelectElement>();
  const cardPacksSelect = createRef<HTMLFieldSetElement>();
  const trpcContext = trpc.useContext();
  const lobby = useContext(LobbyContext);
  const broadcast = useBroadcastEvent();

  const [error, setError] = useState<string | null>(null);

  const setOptions = liveblocksMutation(
    ({ storage, self }, options, players: string[]) => {
      ///////////////////////////
      //ERROR NEEDS TO BE SET WITH TRY CATCH
      ///////////////////////////
      const parsedOptions = FormOptionsInputsParser.parse(options);
      const obj: CAHGameOptions = new LiveObject({
        pointsToWin: parsedOptions.pointsToWin,
        whiteCardsPerPlayer: parsedOptions.whiteCardsPerPlayer,
      });
      const parsedPlayers = ConnectedPlayersParser.parse(players);
      const myId = self.id;
      storage.get("CAH").set("currentHost", myId);
      storage.get("CAH").set("options", obj);
      storage.get("CAH").set("cardPackIds", options.cardPacks);
      storage.get("CAH").set("connectedPlayers", parsedPlayers);
      storage
        .get("CAH")
        .set("currentWhiteCardIndex", parsedOptions.currentWhiteCard-parsedPlayers.length*parsedOptions.whiteCardsPerPlayer);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const pointsToWin = pointsToWinInput.current?.value;
      const cardsPerPlayer = cardsPerPlayerInput.current?.value;
      const cardPacksElements = cardPacksSelect.current;
      if (!cardPacksElements) return;
      if (!lobby) throw new Error("No lobby found");

      const playerData = (
        await trpcContext.lobby.getConnectedPlayers.fetch(lobby.id)
      ).map((player) => player.id);

      const cardPacks = Array.from(cardPacksElements.elements)
        .map((e) => e as HTMLInputElement)
        .filter((e: HTMLInputElement) => e.checked)
        .map((e: HTMLInputElement) => e.value.split("_").map(string => string.replace("_", "")));
        let whiteCardCount = 0;
        cardPacks.forEach((item) => {
          whiteCardCount += parseInt(item[1] as string);
        })
        const cardPackIds = cardPacks.map(pack => pack[0]);
        console.log(cardPackIds)
      const gameOptions = {
        pointsToWin: pointsToWin ? parseInt(pointsToWin) : 10,
        whiteCardsPerPlayer: cardsPerPlayer ? parseInt(cardsPerPlayer) : 10,
        cardPacks: cardPackIds,
        currentWhiteCard: whiteCardCount,
      };
      broadcast({type: "card packs selected", cardPacks: cardPacks.map(pack => pack[0]) as string[] });
      window.dispatchEvent(new CustomEvent("card packs selected", {detail: {cardPacks: cardPacks.map(pack => pack[0]) as string[]}}))
      setOptions(gameOptions, playerData);
    } catch (e) {
      if (e instanceof z.ZodError || e instanceof Error) setError(e.message);
      console.log(e);
    }
  };

  // ERROR STATES NEED TO BE SET
  return (
    <div className="flex justify-center">
      <div className="mb-8 flex justify-center shadow-inset">
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <GameSettings pointsToWinInput={pointsToWinInput} cardsPerPlayerInput={cardsPerPlayerInput}/>
          <label className="mt-4 mb-4 text-lg font-semibold drop-shadow-xl" htmlFor="packs">
            Card Packs
          </label>
          <div className="flex p-4 max-w-xl">
            <PacksList cardPacksSelect={cardPacksSelect} data={data}/>
          </div>
          <StartGameButton />
        </form>
      </div>
    </div>
  );
};

export default CAHOptions;
