import MainNavigation from "/components/navigation/MainNavigation";
import ShopTitle from "/components/shop/ShopTitle";
import Collection from "/components/shop/Collection";
import getCollection from "/data/shop/getCollection";

function CollectionHome({ collection }) {
  return (
    <div className="dark:bg-black">
      <MainNavigation />
      {/* <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 relative">
        <ShopTitle />
        <div className="w-full pb-3">
          <Collection collection={collection} />
        </div>
      </div> */}
    </div>
  );
}

export async function getServerSideProps(context) {
  try {
    let uuid = context.params.uuid;
    let res = await getCollection(uuid);
    let collection = res.collection;
    return { props: { collection } };
  } catch (err) {
    console.log(err);
    return { props: {} };
  }
}

export default CollectionHome;
