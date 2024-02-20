import clsx from "clsx";

const UsernameAndEmail = ({
  username, setUsername, email, setEmail,
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

export default UsernameAndEmail;