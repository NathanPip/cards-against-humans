import { useCallback, useMemo } from "react";
import { useOthersMapped, useSelf } from "../../liveblocks.config";
import OtherPlayer from "./OtherPlayer";

const OtherPlayers: React.FC = () => {
  const othersNames = useOthersMapped((other) => other.presence.name);
  const othersIds = useOthersMapped((other) => other.id);
  const isHost = useSelf((self) => self.presence.isHost);
  const consolidatedOthers = useMemo(() => {
    return othersNames.map((name, index) => {
      if (!othersIds || !othersIds[index]) throw new Error("no others found");
      return { name: name[1], id: othersIds[index]![1] };
    });
  }, [othersIds, othersNames]);

  return (
  <ul className={`h-fit bg-zinc-50 bg-opacity-70 z-index-10`}>
    {consolidatedOthers.map((other) => {
        return <OtherPlayer key={other.id} id={other.id} name={other.name} isHost={isHost} />
    })}
  </ul>
  );
};

export default OtherPlayers;
