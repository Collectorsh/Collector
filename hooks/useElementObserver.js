import { useState, useEffect } from 'react'

const useElementObserver = (element, rootMargin) => {
  const [isVisible, setState] = useState(false);
  const [hasBeenObserved, setHasBeenObserved] = useState(false);

  useEffect(() => {
    const current = element.current;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(entry => {
        if (entry) setState(entry.isIntersecting);   
      })
    );
    current && observer.observe(current);

    return () => current && observer.unobserve(current);
  }, [element, rootMargin]);

  useEffect(() => { 
    if(isVisible && !hasBeenObserved) setHasBeenObserved(true)
  },[isVisible, hasBeenObserved])

  return {
    isVisible,
    hasBeenObserved
  };
};

export default useElementObserver