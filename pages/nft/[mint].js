import NotFound from "../../components/404";
import MainNavigation from "../../components/navigation/MainNavigation"
import getTokenByMint, { useTokenByMint } from "../../data/nft/getTokenByMint";
import { nullifyUndefined } from "../../utils/nullifyUndefined";

export default function DetailPage({token}) {

  return <NotFound />
  // const token = useTokenByMint(mint);
  const artistName = token?.artist_name.replace("_", " "); 
  return (
    <>
      <MainNavigation />
      <div>
        other stuff
        <h1>{token?.name}</h1>
        <p>name {artistName}</p>
      </div>
    </>
  )
}

export async function getServerSideProps(context) {
  const mint = context.params.mint;

  const baseToken = await getTokenByMint(mint);
  const token = nullifyUndefined(baseToken);
  return { props: { token } };
}

