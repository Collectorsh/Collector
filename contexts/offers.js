import { createContext, useState } from "react";

const OffersContext = createContext();

export const OffersProvider = ({ children }) => {
  const [offers, setOffers] = useState([]);

  return (
    <OffersContext.Provider value={[offers, setOffers]}>
      {children}
    </OffersContext.Provider>
  );
};

export default OffersContext;
