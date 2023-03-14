import Head from "next/head";
import getMetadataFromMint from "/data/nft/getMetadataFromMint";
import GalleryContainer from "/components/gallery/GalleryContainer";
import GalleryNavigation from "/components/gallery/navigation/GalleryNavigation";
import MainNavigation from "/components/navigation/MainNavigation";
import { cdnImage } from "/utils/cdnImage";
import user from "../test_user.json";
import testMintList from "../test_mints.json";

function Test({ tokens }) {
  return (
    <div className="dark:bg-black">
      <Head>
        {tokens.length > 0 && (
          <>
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content="" />
            <meta name="twitter:description" content="" />
            <meta name="twitter:image" content={cdnImage(tokens[0].mint)} />
          </>
        )}
      </Head>
      {user ? <GalleryNavigation user={user} /> : <MainNavigation />}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 clear-both">
        <div className="mx-auto pt-3">
          {tokens && <GalleryContainer tokens={tokens} user={user} />}
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  let tokens = [];
  for (const mint of testMintList) {
    let token = await getMetadataFromMint(mint);
    token.visible = true;
    tokens.push(token);
  }
  return { props: { tokens } };
}

export default Test;
