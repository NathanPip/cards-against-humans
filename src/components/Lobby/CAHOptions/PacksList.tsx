import { type inferRouterOutputs } from "@trpc/server";
import React from "react";
import { type AppRouter } from "../../../server/trpc/router/_app";

type PacksListProps = {
  cardPacksSelect: React.RefObject<HTMLFieldSetElement>;
  data: inferRouterOutputs<AppRouter>["game"]["getBasicGameInfo"];
};

const PacksList: React.FC<PacksListProps> = ({ cardPacksSelect, data }) => {
  const cardPacks = data.cardPacks.sort((a, b) => {
    if(a._count.whiteCards + a._count.blackCards > b._count.whiteCards + b._count.blackCards) return -1;
    if(a._count.whiteCards + a._count.blackCards < b._count.whiteCards + b._count.blackCards) return 1;
    return 0;
  });

  return (
    <fieldset
      name="packs"
      ref={cardPacksSelect}
      className="relative max-h-60 flex-col overflow-y-hidden shadow-inset"
    >
      <ul
        id="packs"
        className="flex h-full flex-col gap-4 overflow-y-scroll py-3"
      >
        {cardPacks.map((pack, index) => (
          <li className="flex items-center" key={pack.id}>
            <label
              className="ml-2 mr-auto font-semibold drop-shadow-sm"
              htmlFor={pack.name}
              key={pack.id + "label"}
            >
              {pack.name}
            </label>
            <p className="mx-1 rounded-md bg-white py-1 px-2 text-sm font-semibold text-black">
              {pack._count.whiteCards}
            </p>
            <p className="mx-1 mr-4 rounded-md bg-black py-1 px-2 text-sm font-semibold text-white">
              {pack._count.blackCards}
            </p>
            <input
              className="card_pack_checkbox"
              type="checkbox"
              key={pack.id}
              name={pack.name}
              value={pack.id}
              defaultChecked={index === 0}
            />
          </li>
        ))}
      </ul>
    </fieldset>
  );
};

export default PacksList;
