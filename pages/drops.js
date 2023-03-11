import Link from "next/link";
import getAllDrops from "/data/drops/getAllDrops";
import MainNavigation from "/components/navigation/MainNavigation";

export default function Drops({ drops }) {
  return (
    <div className="dark:bg-black">
      <MainNavigation />
      <div className="max-w-7xl mx-auto">
        <div className="mx-auto sm:my-12 py-4 px-4 xl:px-0 bg-white dark:bg-black dark:text-white">
          {/* <img src="/images/drop.png" className="inline h-10 align-middle" /> */}
          <h2 className="align-middle inline my-5 text-3xl sm:text-4xl font-semibold w-full py-1 inline-block text-neutral-900 dark:text-neutral-100">
            Drops by Collector
          </h2>

          <p className="mt-4">Solo and group drops from top artists.</p>

          <p className="mt-4">
            Each drop is shaped by the artists and can include any number of
            1/1s and editions. Collectors randomly receive any piece from the
            drop when they mint.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mt-12">
            {drops.map((drop, index) => (
              <div className="text-center mb-6" key={index}>
                <p className="font-bold mb-1">{drop.name}</p>
                <Link href={`/drops/${drop.slug}`} title={drop.name}>
                  <a>
                    <img
                      src={drop.image}
                      className="w-full h-96 lg:h-72 object-center object-cover"
                    />
                  </a>
                </Link>
                <p className="text-sm mt-2">{drop.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  try {
    let drops = await getAllDrops();
    return { props: { drops } };
  } catch (err) {
    console.log(err);
    let drops = [];
    return { props: { drops } };
  }
}
