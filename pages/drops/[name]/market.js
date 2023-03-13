import getDropFromName from "/data/drops/getDropFromName";
import MainNavigation from "/components/navigation/MainNavigation";
import Secondary from "./secondary";

function Market({ name, drop }) {
  return (
    <div className="dark:bg-black dark:text-whitish">
      <MainNavigation />
      {drop ? (
        <>
          <Secondary drop={drop} />
        </>
      ) : (
        <p className="mt-8 max-w-screen-2xl mx-auto px-4 sm:px-8">
          No drop found with the name {name}
        </p>
      )}
    </div>
  );
}

export async function getServerSideProps(context) {
  try {
    let name = context.params.name;
    let drop = await getDropFromName(name);
    return { props: { name, drop } };
  } catch (err) {
    console.log(err);
    return { props: {} };
  }
}

export default Market;
