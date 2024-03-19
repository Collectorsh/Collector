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

    const curation = await getCurationByName(name)

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