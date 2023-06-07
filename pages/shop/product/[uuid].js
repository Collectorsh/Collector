import MainNavigation from "/components/navigation/MainNavigation";
import ShopTitle from "/components/shop/ShopTitle";
import Product from "/components/shop/Product";
import getProduct from "/data/shop/getProduct";
import { useRouter } from "next/router";

function ProductHome({ product, collection, wallet }) {
  const router = useRouter();
  useEffect(() => {
    router.replace("/")
  }, [router])

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <h1>404</h1>
    </div>
  )
  return (
    <div className="dark:bg-black">
      <MainNavigation />
      {/* <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 relative">
        <ShopTitle />
        <div className="w-full pb-3">
          <Product product={product} collection={collection} wallet={wallet} />
        </div>
      </div> */}
    </div>
  );
}

export async function getServerSideProps(context) {
  try {
    let uuid = context.params.uuid;
    let res = await getProduct(uuid);
    let product = res.product;
    let collection = res.collection;
    let wallet = res.wallet;
    return { props: { product, collection, wallet } };
  } catch (err) {
    console.log(err);
    return { props: {} };
  }
}

export default ProductHome;
