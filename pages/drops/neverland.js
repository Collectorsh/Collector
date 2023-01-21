import { ToastContainer } from "react-toastify";
import MainNavigation from "/components/navigation/MainNavigation";
import { PublicKey } from "@solana/web3.js";
import Gacha from "/components/drops/gacha";

export default function HanaKnight() {
  const address = new PublicKey("CZVTD9ZBvN1ZFjrb2c3sY3pbKcqonybPbXKDfq3rPXcn");

  return (
    <>
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <div className="dark:bg-black">
        <MainNavigation />
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto sm:my-12 p-4 shadow-lg bg-white dark:bg-black dark:text-white">
            <div className="grid grid-cols-1 sm:grid-cols-12">
              <div className="col-span-1 sm:col-span-7">
                <img
                  src="/images/drops/neverland/re43f9ejbhxegwf9re4385fq2h5rltsb.png"
                  className="inline w-16 h-16 align-middle rounded-full"
                />
                <h2 className="ml-4 align-middle inline my-5 text-4xl font-bold w-full py-1 inline-block">
                  PAUSE
                </h2>
                <p className="mt-4">
                  A collective of photographers from all around the world
                  pressing the pause button on life.
                </p>
              </div>
              <div className="col-span-1 mt-4 sm:mt-0 sm:col-span-4 sm:col-end-13">
                <Gacha address={address} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-6">
              <div className="text-center">
                <img
                  src="/images/drops/neverland/765ceaf6f02fac0bf66025d3.jpg"
                  className="w-full h-96 lg:h-64 object-center object-cover"
                />
                <p className="font-bold">Nev</p>
                <p className="underline">A Moment Before</p>
                <p className="text-sm mt-2">Editions: 1</p>
              </div>
              <div className="text-center">
                <img
                  src="/images/drops/neverland/910kg5eat73oe03lj7y910kg5enqt6a1.jpg"
                  className="w-full h-96 lg:h-64 object-center object-cover"
                />
                <p className="font-bold">George Figueroa</p>
                <p className="underline">Bathed in Gold</p>
                <p className="text-sm mt-2">Editions: 1</p>
              </div>
              <div className="text-center">
                <img
                  src="/images/drops/neverland/a1oemy4hf3jx26zl3w3a1oglgqm6kwk2.jpg"
                  className="w-full h-96 lg:h-64 object-center object-cover"
                />
                <p className="font-bold">H A N</p>
                <p className="underline">London Has Fallen</p>
                <p className="text-sm mt-2">Editions: 15</p>
              </div>
              <div className="text-center">
                <img
                  src="/images/drops/neverland/i1vsarb9ktx4xwhampi1vsarb4x72sdp.jpg"
                  className="w-full h-96 lg:h-64 object-center object-cover"
                />
                <p className="font-bold">Hacs</p>
                <p className="underline">pajarero</p>
                <p className="text-sm mt-2">Editions: 15</p>
              </div>
              <div className="text-center">
                <img
                  src="/images/drops/neverland/0o1ybvhb8vt95n5po50dc9r0o1yb14jq.jpg"
                  className="w-full h-96 lg:h-64 object-center object-cover"
                />
                <p className="font-bold">Huxsterized</p>
                <p className="underline">Grey Sunday</p>
                <p className="text-sm mt-2">Editions: 1</p>
              </div>
              <div className="text-center">
                <img
                  src="/images/drops/neverland/infkwshe4rw74tcpjlqninfkwts2rtc5.jpg"
                  className="w-full h-96 lg:h-64 object-center object-cover"
                />
                <p className="font-bold">Jakob Lilja-Ruiz</p>
                <p className="underline">Birds nest</p>
                <p className="text-sm mt-2">Editions: 15</p>
              </div>
              <div className="text-center">
                <img
                  src="/images/drops/neverland/xrqvkq1ae7ni11b5gf7dxrqvkqts0dsx.jpg"
                  className="w-full h-96 lg:h-64 object-center object-cover"
                />
                <p className="font-bold">Jairinho</p>
                <p className="underline">Lift Off</p>
                <p className="text-sm mt-2">Editions: 15</p>
              </div>
              <div className="text-center">
                <img
                  src="/images/drops/neverland/h4oazkg1k558y4h4oazkvg0gg38w6ult.jpg"
                  className="w-full h-96 lg:h-64 object-center object-cover"
                />
                <p className="font-bold">Jay Toor</p>
                <p className="underline">Rain or shine</p>
                <p className="text-sm mt-2">Editions: 15</p>
              </div>
              <div className="text-center">
                <img
                  src="/images/drops/neverland/6bgmz4zt59su1ekgy2sui16bgmz81dxo.jpg"
                  className="w-full h-96 lg:h-64 object-center object-cover"
                />
                <p className="font-bold">JOM</p>
                <p className="underline">Floating</p>
                <p className="text-sm mt-2">Editions: 1</p>
              </div>
              <div className="text-center">
                <img
                  src="/images/drops/neverland/twvq5l8hiyhpicrpsf7jqtwvq5n278c6.png"
                  className="w-full h-96 lg:h-64 object-center object-cover"
                />
                <p className="font-bold">layers</p>
                <p className="underline">duality</p>
                <p className="text-sm mt-2">Editions: 1</p>
              </div>
              <div className="text-center">
                <img
                  src="/images/drops/neverland/cytqygast1zgbrbscytqygidybo8dycb.jpg"
                  className="w-full h-96 lg:h-64 object-center object-cover"
                />
                <p className="font-bold">Logan Jamess</p>
                <p className="underline">Reflect</p>
                <p className="text-sm mt-2">Editions: 15</p>
              </div>
              <div className="text-center">
                <img
                  src="/images/drops/neverland/5xg2inpi7al29f0kln5xg2in3erlxks9.jpg"
                  className="w-full h-96 lg:h-64 object-center object-cover"
                />
                <p className="font-bold">Naj Shukor</p>
                <p className="underline">The Great Journey</p>
                <p className="text-sm mt-2">Editions: 15</p>
              </div>
              <div className="text-center">
                <img
                  src="/images/drops/neverland/3p1i0vafp9o7w12tw3p1is2h48yhzdn2.jpg"
                  className="w-full h-96 lg:h-64 object-center object-cover"
                />
                <p className="font-bold">Rich Herrmann</p>
                <p className="underline">Symmetry and Fog</p>
                <p className="text-sm mt-2">Editions: 15</p>
              </div>
              <div className="text-center">
                <img
                  src="/images/drops/neverland/i38t3ngsi512ll318i38t37rbmlp3gkr.jpg"
                  className="w-full h-96 lg:h-64 object-center object-cover"
                />
                <p className="font-bold">TaintedPhotog</p>
                <p className="underline">County Road, Wyoming</p>
                <p className="text-sm mt-2">Editions: 15</p>
              </div>
              <div className="text-center">
                <img
                  src="/images/drops/neverland/re43f9ejbhxegwf9re4385fq2h5rltsb.png"
                  className="w-full h-96 lg:h-64 object-center object-cover"
                />
                <p className="font-bold">PAUSE Poster</p>
                <p className="underline">PAUSE Drop Poster</p>
                <p className="text-sm mt-2">Editions: 30</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
