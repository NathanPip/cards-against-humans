import { LiveList, LiveObject } from "@liveblocks/client";
import { type inferRouterOutputs } from "@trpc/server";
import { useContext, useRef, useState } from "react";
import { z } from "zod";
import { useMutation as liveblocksMutation } from "../liveblocks.config";
import { LobbyContext } from "../pages/lobby/id";
import { type AppRouter } from "../server/trpc/router/_app";
import { type CAHGameOptions } from "../types/game";
import { trpc } from "../utils/trpc";

type GameProps = {
  name: "Cards Against Humanity";
};

const GameSelect: React.FC<GameProps> = ({ name }) => {
  const gameInfo = trpc.game.getBasicGameInfo.useQuery({ name });

  if (gameInfo.isLoading) return <div>Loading...</div>;

  if (gameInfo.isError || !gameInfo.data) return <div>Error</div>;

  return (
    <div>
      <h1>{name}</h1>
      <CAHOptions data={gameInfo.data} />
    </div>
  );
};

type CAHOptionsProps = {
  data: inferRouterOutputs<AppRouter>["game"]["getBasicGameInfo"];
};

const FormOptionsInputsParser = z.object({
  pointsToWin: z.number().min(1).max(100),
  whiteCardsPerPlayer: z.number().min(1).max(25),
  whiteCardIds: z.array(z.string().cuid()),
  blackCardIds: z.array(z.string().cuid()),
});

const ConnectedPlayersParser = z.array(z.string()).nonempty()

const CAHOptions: React.FC<CAHOptionsProps> = ({ data }) => {
  const pointsToWinInput = useRef<HTMLInputElement>(null);
  const cardsPerPlayerInput = useRef<HTMLInputElement>(null);
  const cardPacksSelect = useRef<HTMLFieldSetElement>(null);
  const trpcContext = trpc.useContext();
  const lobby = useContext(LobbyContext);

  const [error, setError] = useState<string | null>(null);

  const setOptions = liveblocksMutation(({ storage }, options, players: string[]) => {
    //ERROR NEEDS TO BE SET WITH TRY CATCH
    const parsedOptions = FormOptionsInputsParser.parse(options);
    const obj: CAHGameOptions = new LiveObject({
      pointsToWin: parsedOptions.pointsToWin,
      whiteCardsPerPlayer: parsedOptions.whiteCardsPerPlayer,
      whiteCardIds: new LiveList(parsedOptions.whiteCardIds),
      blackCardIds: new LiveList(parsedOptions.blackCardIds),
    });
    const parsedPlayers = ConnectedPlayersParser.parse(players);
    const playersList = new LiveList(parsedPlayers);
    storage.get("CAH").set("options", obj);
    storage.get("CAH").set("connectedPlayers", playersList);
    storage.get("CAH").set("currentPlayerDrawing", parsedPlayers[0]);
  }, []);

  const setisPlaying = liveblocksMutation(({ storage }) => {
      storage.set("currentGame", "Cards Against Humanity");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const pointsToWin = pointsToWinInput.current?.value;
      const cardsPerPlayer = cardsPerPlayerInput.current?.value;
      const cardPacksElements = cardPacksSelect.current;
      if (!cardPacksElements) return;

      const cardPacks = Array.from(cardPacksElements.elements)
        .map((e) => e as HTMLInputElement)
        .filter((e: HTMLInputElement) => e.checked)
        .map((e: HTMLInputElement) => e.value);

      // ERROR NEEDS TO BE SET WITH TRY CATCH
      const packData = await trpcContext.game.getSelectedCardPacks.fetch(
        cardPacks
      );
      const playerData = await (await trpcContext.lobby.getConnectedPlayers.fetch(lobby!.id)).map((player) => player.id);
      if (!packData) throw new Error("No card packs found");
      const whiteCardIds: string[] = [];
      const blackCardIds: string[] = [];
      packData.cardPacks.forEach((pack) => {
        whiteCardIds.push(...pack.whiteCards.map((card) => card.id));
        blackCardIds.push(...pack.blackCards.map((card) => card.id));
      });
      whiteCardIds.sort(() => Math.random() - 0.5);
      blackCardIds.sort(() => Math.random() - 0.5);
      const gameOptions = {
        pointsToWin: pointsToWin ? parseInt(pointsToWin) : 10,
        whiteCardsPerPlayer: cardsPerPlayer ? parseInt(cardsPerPlayer) : 10,
        whiteCardIds,
        blackCardIds,
        currentCard: whiteCardIds.length-1
      };

      setOptions(gameOptions, playerData);
      setisPlaying();
    } catch (e) {
      if (e instanceof z.ZodError || e instanceof Error) setError(e.message);
    }
  };

  // ERROR STATES NEED TO BE SET
  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <label htmlFor="points-to-win">Score To Win</label>
      <input
        type="text"
        defaultValue={10}
        id="points-to-win"
        ref={pointsToWinInput}
      />
      <label htmlFor="cards-per-player">White Cards Per Player</label>
      <input
        type="text"
        defaultValue={10}
        id="cards-per-player"
        ref={cardsPerPlayerInput}
      />
      <label htmlFor="packs">Card Packs</label>
      <fieldset
        name="packs"
        id="packs"
        ref={cardPacksSelect}
        className="flex max-h-80 max-w-fit flex-col overflow-y-scroll"
      >
        {data.cardPacks.map((pack) => (
          <>
            <label htmlFor={pack.name}>{pack.name}</label>
            <input
              type="checkbox"
              key={pack.id}
              name={pack.name}
              value={pack.id}
            />
          </>
        ))}
      </fieldset>
      <button type="submit">Start Game</button>
    </form>
  );
};

export default GameSelect;
