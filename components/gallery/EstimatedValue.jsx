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
        <div className="rounded-[100px] backdrop-blur-lg bg-white/60 px-4 py-2 font-semibold cursor-pointer absolute bottom-2 left-2 hover:scale-105">
          Estimate: ◎{roundToTwo(estimate / 1000000000)}
        </div>
      )}
    </>
  );
}
