import MainNavigation from "/components/navigation/MainNavigation";
import getHubFromUsername from "/data/hubs/getHubFromUsername";
import CuratorHub from "/components/hubs/CuratorHub";

function Hub({ username, hub, allowed_users }) {
  return (
    <div className="dark:bg-black dark:text-whitish">
      <MainNavigation />
      {!hub && <>We couldn&apos;t find a Curator Hub for {username}</>}
      {hub && <CuratorHub hub={hub} allowed_users={allowed_users} />}
    </div>
  );
}

export async function getServerSideProps(context) {
  try {
    let username = context.params.gallery;
    let res = await getHubFromUsername(username);
    if (res.status === "success") {
      let hub = res.hub;
      let allowed_users = res.allowed_users;
      return { props: { username, hub, allowed_users } };
    } else {
      return { props: { username } };
    }
  } catch (err) {
    console.log(err);
    return { props: {} };
  }
}

export default Hub;
