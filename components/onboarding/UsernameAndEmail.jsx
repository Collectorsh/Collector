const UsernameAndEmail = ({ username, setUsername, email, setEmail }) => {

  return (
    <div>
      <p className="font-bold text-lg mb-1 ml-4">Username*</p>
      <input
        className="border-4 rounded-xl
        border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900 
        w-full p-3"
        onChange={(e) => setUsername(e.target.value.replaceAll(" ", "_"))}
        value={username}
        placeholder="Username"
      />

      <p className="font-bold text-lg mb-1 ml-4 mt-4">Email</p>
      <input
        className="border-4 rounded-xl
        border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900 
        w-full p-3"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        placeholder="Email"
      />
    </div>
  )
};

export default UsernameAndEmail;