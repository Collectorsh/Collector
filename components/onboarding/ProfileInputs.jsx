import Tippy from "@tippyjs/react";
import clsx from "clsx";

import * as Icon from "react-feather"

export const ProfileDisplayName = ({
  displayName, setDisplayName,
  paletteClass = "bg-neutral-100 border-neutral-200 dark:bg-neutral-900 dark:border-neutral-800"
}) => {
  const info = (
    <Tippy
      content="The name shown in your gallery and on artworks you've created or collected"
    >
      <Icon.Info size={14} className="opacity-50" />
    </Tippy>
  )
  return (
    <div>
      <p className="font-bold text-lg ml-4 mt-2 flex gap-1">Display Name {info}</p>
      <input
        className={clsx("my-1 border-2 rounded-lg outline-none w-full px-4 py-2", paletteClass)}
        onChange={(e) => setDisplayName(e.target.value)}
        value={displayName}
        placeholder="Display Name"
      />
    </div>
  )
};

export const ProfileUsername = ({
  username, setUsername,
  paletteClass = "bg-neutral-100 border-neutral-200 dark:bg-neutral-900 dark:border-neutral-800"
}) => {
  const info = (
    <Tippy
      content={["Your unique handle used in urls", <br key="break"/>, "(e.g. collector.sh/username)"]}
    >
      <Icon.Info size={14} className="opacity-50" />
    </Tippy>
  )

  return (
    <div>
      <p className="font-bold text-lg ml-4 mt-2 flex gap-1">Username {info}</p>
      <input
        className={clsx("my-1 border-2 rounded-lg outline-none w-full px-4 py-2", paletteClass)}
        onChange={(e) => setUsername(e.target.value.replaceAll(" ", "_"))}
        value={username}
        placeholder="Username"
      />
    </div>
  )
};

export const ProfileEmail = ({
  email, setEmail,
  paletteClass = "bg-neutral-100 border-neutral-200 dark:bg-neutral-900 dark:border-neutral-800"
}) => {

  return (
    <div>
      <p className="font-bold text-lg ml-4 mt-2">Email <span className="text-sm textPalette2">(optional)</span></p>
      <input
        className={clsx("my-1 border-2 rounded-lg outline-none w-full px-4 py-2", paletteClass)}
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        placeholder="Email"
      />
    </div>
  )
};