import { createContext, useState } from "react";

const ActivitiesContext = createContext();

export const ActivitiesProvider = ({ children }) => {
  const [activities, setActivities] = useState([]);

  return (
    <ActivitiesContext.Provider value={[activities, setActivities]}>
      {children}
    </ActivitiesContext.Provider>
  );
};

export default ActivitiesContext;
