import { useEffect } from 'react';

const  usePreventTouchNavigation = (ref) => {
  useEffect(() => {
    const element = ref.current;

    const handleTouchStart = (e) => {
      e.preventDefault();
    };

    if (element) {
      element.addEventListener('touchstart', handleTouchStart, { passive: false });
    }

    return () => {
      if (element) {
        element.removeEventListener('touchstart', handleTouchStart);
      }
    };
  }, [ref]);
}

export default usePreventTouchNavigation;
