import { createContext, useState } from "react";

const ExchangeOffersContext = createContext();

export const ExchangeOffersProvider = ({ children }) => {
  const [exchangeOffers, setExchangeOffers] = useState([]);

  return (
    <ExchangeOffersContext.Provider value={[exchangeOffers, setExchangeOffers]}>
      {children}
    </ExchangeOffersContext.Provider>
  );
};

export default ExchangeOffersContext;
