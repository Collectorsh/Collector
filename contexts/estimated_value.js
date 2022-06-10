import { createContext, useState } from "react";

const EstimatedValueContext = createContext();

export const EstimatedValueProvider = ({ children }) => {
  const [estimated, setEstimated] = useState([]);

  return (
    <EstimatedValueContext.Provider value={[estimated, setEstimated]}>
      {children}
    </EstimatedValueContext.Provider>
  );
};

export default EstimatedValueContext;
