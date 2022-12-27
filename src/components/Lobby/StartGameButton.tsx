import { useEffect, useState } from "react";

const StartGameButton: React.FC = () => {
  
    const [canStart, setCanStart] = useState(false);

    useEffect(() => {
    window.addEventListener("can start", (event) => {
        const e = event as CustomEvent;
        const detail = e.detail;
        setCanStart(detail)
    })
  }, []);

  return (
    <button
      className={`${canStart ? "bg-blue-500" : "bg-slate-700 pointer-events-none"} mt-14 mb-4 h-14 w-2/5 rounded-xl bg-blue-500 font-bold text-white hover:bg-blue-700`}
      type="submit"
    >
      Start Game
    </button>
  );
};

export default StartGameButton;
