import MainNavigation from "/components/navigation/MainNavigation";
import ShopTitle from "/components/shop/ShopTitle";
import Product from "/components/shop/Product";
import getProduct from "/data/shop/getProduct";

function ProductHome({ product }) {
  return (
    <div className="dark:bg-black">
      <MainNavigation />
      <div className="max-w-7xl mx-auto">
        <div className="relative">
          <ShopTitle />
          <div className="w-full pb-3">
            <Product product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  try {
    let uuid = context.params.uuid;
    let res = await getProduct(uuid);
    let product = res.product;
    return { props: { product } };
  } catch (err) {
    console.log(err);
    return { props: {} };
  }
}

export default ProductHome;
