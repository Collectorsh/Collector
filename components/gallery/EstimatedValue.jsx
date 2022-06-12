import React, { useState, useEffect, useCallback, useContext } from "react";
import { roundToTwo } from "/utils/roundToTwo";
import getEstimatedValue from "/data/getEstimatedValue";
import EstimatedValueContext from "/contexts/estimated_value";

export default function EstimatedValue({ token }) {
  const [totalEstimate, setTotalEstimate] = useContext(EstimatedValueContext);
  const [estimate, setEstimate] = useState();

  const fetchEstimatedValue = useCallback(async () => {
    try {
      const est = totalEstimate.find((e) => e.mint === token.mint);
      if (est) {
        // Found in context. update component state but not totalEstimate context
        setEstimate(est.estimate);
      } else {
        // Not found in context
        const res = await getEstimatedValue(token);
        if (res.estimate) {
          setEstimate(res.estimate);
          setTotalEstimate((prevState) => {
            let newState = [...prevState];
            newState.push({ mint: token.mint, estimate: res.estimate });
            return newState;
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    if (!token) return;
    fetchEstimatedValue();
  }, [token]);

  return (
    <>
      {estimate && (
        <p className="text-sm clear-both text-dark3 dark:text-gray-300 bg-whitish dark:bg-dark3 w-fit px-2 py-1 rounded mt-4">
          Estimate: ◎{roundToTwo(estimate / 1000000000)}
        </p>
      )}
    </>
  );
}
