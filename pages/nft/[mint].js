import { useRouter } from "next/router";
import NotFound from "../../components/404";
import { useEffect } from "react";


export default function DetailPage({mint}) {
  const router = useRouter();
  useEffect(() => {
    router.replace(`/art/${mint}`)
  }, [router, mint])
  return <NotFound />
}



export async function getServerSideProps(context) {
  const mint = context.params.mint;
  try {
    // const baseCurations = await getCurationsByListingMint(mint)
    //   .then(res => res?.curations);
  
    // const curations = nullifyUndefinedArr(baseCurations);
    // const onlyPublished = curations?.filter(curation => curation.is_published)
    // const baseToken = await getTokenByMint(mint);
    // const token = nullifyUndefinedObj(baseToken);

    // return { props: { token, curations: onlyPublished } };
    return { props: { mint } }
  } catch (err) { 
    console.log("Error getting token by mint:", err.message)
    return { props: { token: null, curations: null } }
  }
}

