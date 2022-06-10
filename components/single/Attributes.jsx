export default function Attributes({ token }) {
  if (
    !token.attributes ||
    !Array.isArray(token.attributes) ||
    token.attributes.length === 0
  )
    return <></>;

  return (
    <>
      <h4 className="text-lg text-black dark:text-white uppercase mt-10 lg:mt-12">
        attributes
      </h4>
      <div className="flex flex-col">
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block py-2 min-w-full sm:px-6 lg:px-8">
            <div className="overflow-hidden">
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
