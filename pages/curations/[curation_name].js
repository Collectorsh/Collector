import { useEffect } from "react";
import getCurationByName from "../../data/curation/getCurationByName";
import { useRouter } from "next/router";
import NotFound from "../../components/404";

function CurationPage({curation}) {
  const router = useRouter();

  useEffect(() => {
    
    router.replace(`/${curation.curator.username}/${ curation.name }`)
    
  }, [router, curation])

  return <NotFound />
}



export async function getServerSideProps(context) {
  try {
    const name = context.params.curation_name;

    const username = undefined; //not available with this url path (TODO, maybe add options to link to?)

    const curation = await getCurationByName(username, name)

    if (curation) {
      return { props: { curation } };
    } else {
      return { props: {} };
    }
  } catch (err) {
    console.log(err);
    return { props: {} };
  }
}

export default CurationPage;