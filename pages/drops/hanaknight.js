import { ToastContainer } from "react-toastify";
import MainNavigation from "/components/navigation/MainNavigation";
import { PublicKey } from "@solana/web3.js";
import Gacha from "/components/drops/gacha";

export default function HanaKnight() {
  const address = new PublicKey("6fS5FrFkfgxL5US87NGngHExFDV4cjZ2SB7yL1PyQJx9");

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
                  src="/images/hanaknight.jpeg"
                  className="inline w-16 h-16 align-middle rounded-full"
                />
                <h2 className="ml-4 align-middle inline my-5 text-4xl font-bold w-full py-1 inline-block">
                  Hana Knight
                </h2>
              </div>
              <div className="col-span-1 mt-4 sm:mt-0 sm:col-span-4 sm:col-end-13">
                <Gacha address={address} />
              </div>
            </div>

            <p className="text-xl font-bold mt-6 sm:mt-0">Nusantara Blooming</p>
            <p className="mt-4">
              A collection of varied interpretations surrounding the theme of
              nature and humanity. Brought to you by artists across genres from
              Indonesia.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-6">
              <div className="text-center">
                <img
                  src="/images/drops/hanaknight/k9lvii971i33ooy59c6xk9lviwbscdq6.png"
                  className="w-full h-96 lg:h-64 object-center object-cover"
                />
                <p className="font-bold">hanaknight</p>
                <p className="underline">Bouquet Balloons</p>
                <p className="text-sm mt-2">Editions: 5</p>
              </div>
              <div className="text-center">
                <img
                  src="/images/drops/hanaknight/dvlyfxegc84g6524wundvlimqmpm855o.png"
                  className="w-full h-96 lg:h-64 object-center object-cover"
                />
                <p className="font-bold">hanaknight</p>
                <p className="underline">BlackPink Oreo Tickets</p>
                <p className="text-sm mt-2">Editions: 3</p>
              </div>
              <div className="text-center">
                <img
                  src="/images/drops/hanaknight/urpcoob9iehl1urpcjma6azucq7lxuet.jpg"
                  className="w-full h-96 lg:h-64 object-center object-cover"
                />
                <p className="font-bold">hanaknight</p>
                <p className="underline">Hanaknight Favour Token</p>
                <p className="text-sm mt-2">Editions: 1</p>
              </div>
              <div className="text-center">
                <img
                  src="/images/drops/hanaknight/nm60u1dgr31nfnm6ui7i8vjzmozu3ui7.png"
                  className="w-full h-96 lg:h-64 object-center object-cover"
                />
                <p className="font-bold">Balada Perupa</p>
                <p className="underline">The Guardian of Mystical Forest</p>
                <p className="text-sm mt-2">Editions: 5</p>
              </div>
              <div className="text-center">
                <img
                  src="/images/drops/hanaknight/saihw59ydsisa3k91watgku6187otc9g.png"
                  className="w-full h-96 lg:h-64 object-center object-cover"
                />
                <p className="font-bold">hanaknight</p>
                <p className="underline">A Museum of the Heart Token</p>
                <p className="text-sm mt-2">Editions: 1</p>
              </div>
              <div className="text-center">
                <img
                  src="/images/drops/hanaknight/6aapygo2er8yl8q3h6aapwcjmis8jv4f.png"
                  className="w-full h-96 lg:h-64 object-center object-cover"
                />
                <p className="font-bold">MEK.txt</p>
                <p className="underline">Sienna Bloom</p>
                <p className="text-sm mt-2">Editions: 5</p>
              </div>
              <div className="text-center">
                <img
                  src="/images/drops/hanaknight/ibffqpfcfsv3xonyudmibffq32c8ikuj.jpg"
                  className="w-full h-96 lg:h-64 object-center object-cover"
                />
                <p className="font-bold">Arissu</p>
                <p className="underline">Destruction</p>
                <p className="text-sm mt-2">Editions: 5</p>
              </div>
              <div className="text-center">
                <img
                  src="/images/drops/hanaknight/waqsgkfx0bi9h1j1waqsgzbe30m3vw79.jpg"
                  className="w-full h-96 lg:h-64 object-center object-cover"
                />
                <p className="font-bold">Monkseal</p>
                <p className="underline">The Medium</p>
                <p className="text-sm mt-2">Editions: 5</p>
              </div>
              <div className="text-center">
                <img
                  src="/images/drops/hanaknight/q3jgxzf3ozbs0pzuxleiq3jgxzfhp5qv.jpg"
                  className="w-full h-96 lg:h-64 object-center object-cover"
                />
                <p className="font-bold">Fickle Sight</p>
                <p className="underline">The Empress Of The North</p>
                <p className="text-sm mt-2">Editions: 5</p>
              </div>
              <div className="text-center">
                <img
                  src="/images/drops/hanaknight/oleat3n6t2csnbs9oxhqoleat35048ze.jpg"
                  className="w-full h-96 lg:h-64 object-center object-cover"
                />
                <p className="font-bold">Lapantigatiga</p>
                <p className="underline">The Mirror</p>
                <p className="text-sm mt-2">Editions: 5</p>
              </div>
              <div className="text-center">
                <img
                  src="/images/drops/hanaknight/t2oroj8s5on1zjxgeftt2orojvwlfag4.png"
                  className="w-full h-96 lg:h-64 object-center object-cover"
                />
                <p className="font-bold">Adam Alfisyar</p>
                <p className="underline">Glide to the Final Destination</p>
                <p className="text-sm mt-2">Editions: 5</p>
              </div>
              <div className="text-center">
                <img
                  src="/images/drops/hanaknight/83fsu3p3kmp01883fsz78a6ls5h5dmm6.jpg"
                  className="w-full h-96 lg:h-64 object-center object-cover"
                />
                <p className="font-bold">Ordinary</p>
                <p className="underline">Autumn</p>
                <p className="text-sm mt-2">Editions: 5</p>
              </div>
              <div className="text-center">
                <img
                  src="/images/drops/hanaknight/4va7jvcmxgp58gtznzd94va7jvcu5cd7.gif"
                  className="w-full h-96 lg:h-64 object-center object-cover"
                />
                <p className="font-bold">Duckzzy</p>
                <p className="underline">The Ostara</p>
                <p className="text-sm mt-2">Editions: 5</p>
              </div>
              <div className="text-center">
                <img
                  src="/images/drops/hanaknight/im9cdihbg7l86xr83roxyim9cdihcjx0.jpg"
                  className="w-full h-96 lg:h-64 object-center object-cover"
                />
                <p className="font-bold">Cufives</p>
                <p className="underline">Bloom</p>
                <p className="text-sm mt-2">Editions: 5</p>
              </div>
              <div className="text-center">
                <img
                  src="/images/drops/hanaknight/kqwounmx26n6d1xkqwoup3orkfrz73e7.png"
                  className="w-full h-96 lg:h-64 object-center object-cover"
                />
                <p className="font-bold">SDNT</p>
                <p className="underline">Sow and Reap</p>
                <p className="text-sm mt-2">Editions: 5</p>
              </div>
              <div className="text-center">
                <img
                  src="/images/drops/hanaknight/83wmmyzkgejswixeg83wmmyxab3qr9xv.jpeg"
                  className="w-full h-96 lg:h-64 object-center object-cover"
                />
                <p className="font-bold">Anindito Wisnu</p>
                <p className="underline">Florette</p>
                <p className="text-sm mt-2">Editions: 5</p>
              </div>
              <div className="text-center">
                <img
                  src="/images/drops/hanaknight/gjx81nbt7mh416vxtigjx81axisvtpsu.png"
                  className="w-full h-96 lg:h-64 object-center object-cover"
                />
                <p className="font-bold">hanaknight</p>
                <p className="underline">CandyWrapperDAO</p>
                <p className="text-sm mt-2">Editions: 10</p>
              </div>
              <div className="text-center">
                <img
                  src="/images/drops/hanaknight/r824fp52r56r820vyoz4f7f2gsrro0vy.jpg"
                  className="w-full h-96 lg:h-64 object-center object-cover"
                />
                <p className="font-bold">destroyxstairs</p>
                <p className="underline">1984</p>
                <p className="text-sm mt-2">Editions: 5</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
