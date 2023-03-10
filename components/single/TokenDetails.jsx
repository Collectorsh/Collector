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
      <div
        id="accordion"
        className="text-black dark:text-whitish mt-12 grid place-items-center w-full bg-[#f8fafc] dark:bg-[#111] px-6 border border-blue-grey-50 dark:border-dark2 rounded-lg scroll-mt-48 overflow-x-scroll lg:overflow-visible"
      >
        <Fragment>
          {token.collection && (
            <Accordion open={open === 1} onClick={() => handleOpen(1)}>
              <AccordionHeader className="">Collection</AccordionHeader>
              <AccordionBody className="text-md ">
                <h2 className="text-2xl mb-4">{token.collection.name}</h2>
                {token.collection.description}
              </AccordionBody>
            </Accordion>
          )}
          <Accordion open={open === 2} onClick={() => handleOpen(2)}>
            <AccordionHeader className="">Token Details</AccordionHeader>
            <AccordionBody className="text-md">
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
                              {token.edition.key === 1 &&
                                token.edition.max_supply && (
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
                              {token.edition.key === 1 &&
                                !token.edition.max_supply && (
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
            </AccordionBody>
          </Accordion>
          {token.attributes &&
            Array.isArray(token.attributes) &&
            token.attributes.length > 0 && (
              <Accordion open={open === 3} onClick={() => handleOpen(3)}>
                <AccordionHeader className="">Attributes</AccordionHeader>
                <AccordionBody className="text-md ">
                  <table className="min-w-full">
                    <tbody>
                      {token.attributes.map((att, index) => (
                        <tr className="border-b dark:border-dark3" key={index}>
                          <td className="py-4 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-gray-300">
                            {att.trait_type}
                          </td>
                          <td className="py-4 text-sm text-gray-500 whitespace-nowrap dark:text-gray-200">
                            {att.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </AccordionBody>
              </Accordion>
            )}
        </Fragment>
      </div>
    </>
  );
}
