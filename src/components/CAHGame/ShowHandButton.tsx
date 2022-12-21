import { useEffect, useState } from "react";
import { useSelf, useStorage } from "../../liveblocks.config";

type ShowHandProps = {
  setIsShown: React.Dispatch<React.SetStateAction<boolean>>;
  isShown: boolean;
};

const ShowHandButton: React.FC<ShowHandProps> = ({ setIsShown, isShown }) => {
  const isTurn = useSelf((me) => me.presence.CAHturn);
  const gameState = useStorage((root) => root.CAH.activeState);

  const [show, setShow] = useState(isShown);

  useEffect(() => {
    if (
      gameState === "judge revealing" ||
      gameState === "waiting for judge" ||
      isTurn
    ) {
      setIsShown(false);
    }
  }, [gameState, isTurn, setIsShown]);

  useEffect(() => {
    if(gameState === "waiting for players" && !isTurn) {
        setIsShown(true)
    }
  }, [gameState, isTurn, setIsShown])

  if (isTurn) return null;

  if (
    gameState !== "judge revealing" &&
    gameState !== "waiting for judge" &&
    !isTurn
  )
    return (
      <button
        onClick={() => {
          setShow((prev) => (prev ? false : true));
          setIsShown((prev) => (prev ? false : true));
        }}
        className="absolute top-0 -my-16 right-0 text-xl mx-4 text-semibold text-shadow-xl"
      >
        {show ? "Hide Cards" : "Show Cards"}
      </button>
    );

  return null;
};

export default ShowHandButton;
