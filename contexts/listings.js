import { createContext, useState } from "react";

const ListingsContext = createContext();

export const ListingsProvider = ({ children }) => {
  const [listings, setListings] = useState([]);

  return (
    <ListingsContext.Provider value={[listings, setListings]}>
      {children}
    </ListingsContext.Provider>
  );
};

export default ListingsContext;
