import { useRouter } from "next/router";
import NotFound from "../../components/404";
import { useEffect } from "react";

function ProfilePage({ username }) {
  const router = useRouter();
  useEffect(() => {
    router.replace(`/${username}`)
  }, [router, username])

  return <NotFound />

}

export async function getServerSideProps(context) {
  try {
    const username = context.params.username;
    return { props: { username } };
  } catch (err) {
    console.log(err);
    return { props: {} };
  }
}

export default ProfilePage;