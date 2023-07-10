import { has } from 'ramda';
import { useState, useEffect, MutableRefObject, useMemo } from 'react'

const useElementObserver = (element, rootMargin) => {
  const [isVisible, setState] = useState(false);
  const [hasBeenObserved, setHasBeenObserved] = useState(false);

  useEffect(() => {
    const current = element.current
    const observer = new IntersectionObserver(
      ([entry]) => {
        setState(entry.isIntersecting);
      }, { rootMargin }
    );

    current && observer.observe(current);

    return () => current && observer.unobserve(current);
  }, [element, rootMargin]);

  useEffect(() => { 
    if(isVisible && !hasBeenObserved) setHasBeenObserved(true)
  },[isVisible, hasBeenObserved])

  // return hasBeenObserved
  return {
    isVisible,
    hasBeenObserved
  };
};

export default useElementObserver