import { useState, Fragment } from "react";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";

export default function TokenDetails({ token }) {
  const [open, setOpen] = useState(0);

  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value);
  };

  function royalty() {
    return token.sellerFeeBasisPoints ? token.sellerFeeBasisPoints / 100 : 0;
  }

  return (
    <>
      <div>
        {token.collection && (
          <div className="mt-12">
            <h2 className="text-2xl mb-4 pb-2 border-b border-neutral-100 dark:border-neutral-900">
              Collection
            </h2>
            <h3 className="text-xl font-semibold mb-4">
              {token.collection.name}
            </h3>
            {token.collection.description}
          </div>
        )}
        <h2 className="text-2xl mt-12 pb-2 border-b border-neutral-100 dark:border-neutral-900">
          Token Details
        </h2>
        <div className="flex flex-col">
          <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block py-2 min-w-full sm:px-6 lg:px-8">
              <div className="overflow-hidden">
                <table className="min-w-full">
                  <tbody>
                    <tr className="">
                      <td className="py-4 text-sm font-medium text-neutral-900 whitespace-nowrap dark:text-neutral-300">
                        Token Mint
                      </td>
                      <td className="py-4 text-sm text-neutral-500 whitespace-nowrap dark:text-neutral-200">
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
                            <tr className="">
                              <td className="py-4 text-sm font-medium text-neutral-900 whitespace-nowrap dark:text-neutral-300">
                                Type
                              </td>
                              <td className="py-4 text-sm text-neutral-500 whitespace-nowrap dark:text-neutral-200">
                                Master Edition
                              </td>
                            </tr>
                            <tr className="">
                              <td className="py-4 text-sm font-medium text-neutral-900 whitespace-nowrap dark:text-neutral-300">
                                Printed
                              </td>
                              <td className="py-4 text-sm text-neutral-500 whitespace-nowrap dark:text-neutral-200">
                                {token.edition.supply || 0}/
                                {token.edition.max_supply}
                              </td>
                            </tr>
                          </>
                        )}
                        {token.edition.key === 1 && token.edition.max_supply && (
                          <>
                            <tr className="">
                              <td className="py-4 text-sm font-medium text-neutral-900 whitespace-nowrap dark:text-neutral-300">
                                Type
                              </td>
                              <td className="py-4 text-sm text-neutral-500 whitespace-nowrap dark:text-neutral-200">
                                Limited Edition
                              </td>
                            </tr>
                            <tr className="">
                              <td className="py-4 text-sm font-medium text-neutral-900 whitespace-nowrap dark:text-neutral-300">
                                Edition Number
                              </td>
                              <td className="py-4 text-sm text-neutral-500 whitespace-nowrap dark:text-neutral-200">
                                {token.edition.supply} of{" "}
                                {token.edition.max_supply}
                              </td>
                            </tr>
                          </>
                        )}
                        {token.edition.key === 1 && !token.edition.max_supply && (
                          <>
                            <tr className="">
                              <td className="py-4 text-sm font-medium text-neutral-900 whitespace-nowrap dark:text-neutral-300">
                                Type
                              </td>
                              <td className="py-4 text-sm text-neutral-500 whitespace-nowrap dark:text-neutral-200">
                                Open Edition
                              </td>
                            </tr>
                            <tr className="">
                              <td className="py-4 text-sm font-medium text-neutral-900 whitespace-nowrap dark:text-neutral-300">
                                Edition Number
                              </td>
                              <td className="py-4 text-sm text-neutral-500 whitespace-nowrap dark:text-neutral-200">
                                {token.edition.supply}
                              </td>
                            </tr>
                          </>
                        )}
                        <tr className="">
                          <td className="py-4 text-sm font-medium text-neutral-900 whitespace-nowrap dark:text-neutral-300">
                            Royalty
                          </td>
                          <td className="py-4 text-sm text-neutral-500 whitespace-nowrap dark:text-neutral-200">
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
        {token.attributes &&
          Array.isArray(token.attributes) &&
          token.attributes.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl mb-4 pb-2 border-b border-neutral-100 dark:border-neutral-900">
                Attributes
              </h2>
              <table className="min-w-full">
                <tbody>
                  {token.attributes.map((att, index) => (
                    <tr className="" key={index}>
                      <td className="py-4 text-sm font-medium text-neutral-900 whitespace-nowrap dark:text-neutral-300">
                        {att.trait_type}
                      </td>
                      <td className="py-4 text-sm text-neutral-500 whitespace-nowrap dark:text-neutral-200">
                        {att.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </div>
    </>
  );
}
