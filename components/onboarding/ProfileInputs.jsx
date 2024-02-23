import clsx from "clsx";

export const ProfileDisplayName = ({
  displayName, setDisplayName,
  paletteClass = "bg-zinc-100 border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800"
}) => {

  return (
    <div>
      <p className="font-bold text-lg mb-1 ml-4">Display Name</p>
      <input
        className={clsx("my-1 border-2 rounded-lg outline-none w-full px-4 py-2", paletteClass)}
        onChange={(e) => setDisplayName(e.target.value)}
        value={displayName}
        placeholder="Username"
      />
    </div>
  )
};

export const ProfileUsername = ({
  username, setUsername,
  paletteClass = "bg-zinc-100 border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800"
}) => {

  return (
    <div>
      <p className="font-bold text-lg mb-1 ml-4">Username</p>
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
  paletteClass = "bg-zinc-100 border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800"
}) => {

  return (
    <div>
      <p className="font-bold text-lg mb-1 ml-4 mt-4">Email</p>
      <input
        className={clsx("my-1 border-2 rounded-lg outline-none w-full px-4 py-2", paletteClass)}
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        placeholder="Email"
      />
    </div>
  )
};