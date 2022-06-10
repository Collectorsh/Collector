export default function TokenDetails({ token }) {
  function royalty() {
    return token.sellerFeeBasisPoints ? token.sellerFeeBasisPoints / 100 : 0;
  }

  return (
    <>
      <h4 className="text-lg text-black uppercase mt-10 lg:mt-12 dark:text-white">
        token details
      </h4>
      <div className="flex flex-col">
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block py-2 min-w-full sm:px-6 lg:px-8">
            <div className="overflow-hidden">
              <table className="min-w-full">
                <tbody>
                  <tr className="border-b dark:border-dark3">
                    <td className="py-4 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-gray-300">
                      Token Mint
                    </td>
                    <td className="py-4 text-sm text-gray-500 whitespace-nowrap dark:text-gray-200">
                      <a
                        href={`https://solscan.io/account/${token.mint}`}
                        target="_blank"
                        rel="noreferrer"
                        title=""
                      >
                        {token.mint.substr(0, 4)}...
                        {token.mint.slice(-4)}
                      </a>
                    </td>
                  </tr>
                  {token.edition && (
                    <>
                      {[2, 6].includes(token.edition.key) && (
                        <>
                          <tr className="border-b dark:border-dark3">
                            <td className="py-4 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-gray-300">
                              Type
                            </td>
                            <td className="py-4 text-sm text-gray-500 whitespace-nowrap dark:text-gray-200">
                              Master Edition
                            </td>
                          </tr>
                          <tr className="border-b dark:border-dark3">
                            <td className="py-4 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-gray-300">
                              Printed
                            </td>
                            <td className="py-4 text-sm text-gray-500 whitespace-nowrap dark:text-gray-200">
                              {token.edition.supply || 0}/
                              {token.edition.max_supply}
                            </td>
                          </tr>
                        </>
                      )}
                      {token.edition.key === 1 && token.edition.max_supply && (
                        <>
                          <tr className="border-b dark:border-dark3">
                            <td className="py-4 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-gray-300">
                              Type
                            </td>
                            <td className="py-4 text-sm text-gray-500 whitespace-nowrap dark:text-gray-200">
                              Limited Edition
                            </td>
                          </tr>
                          <tr className="border-b dark:border-dark3">
                            <td className="py-4 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-gray-300">
                              Edition Number
                            </td>
                            <td className="py-4 text-sm text-gray-500 whitespace-nowrap dark:text-gray-200">
                              {token.edition.supply} of{" "}
                              {token.edition.max_supply}
                            </td>
                          </tr>
                        </>
                      )}
                      {token.edition.key === 1 && !token.edition.max_supply && (
                        <>
                          <tr className="border-b dark:border-dark3">
                            <td className="py-4 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-gray-300">
                              Type
                            </td>
                            <td className="py-4 text-sm text-gray-500 whitespace-nowrap dark:text-gray-200">
                              Open Edition
                            </td>
                          </tr>
                          <tr className="border-b dark:border-dark3">
                            <td className="py-4 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-gray-300">
                              Edition Number
                            </td>
                            <td className="py-4 text-sm text-gray-500 whitespace-nowrap dark:text-gray-200">
                              {token.edition.supply}
                            </td>
                          </tr>
                        </>
                      )}
                      <tr className="border-b dark:border-dark3">
                        <td className="py-4 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-gray-300">
                          Royalty
                        </td>
                        <td className="py-4 text-sm text-gray-500 whitespace-nowrap dark:text-gray-200">
                          {royalty()}%
                        </td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
