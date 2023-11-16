import { useEffect } from 'react';

const  usePreventTouchNavigation = (ref) => {
  useEffect(() => {
    const element = ref.current.contentWindow.document;
;

    const handleTouchStart = (e) => {
      e.preventDefault();
    };

    if (element) {
      element.addEventListener('touchstart', handleTouchStart, { passive: false });
      element.addEventListener('touchmove', handleTouchStart, { passive: false });
    }

    return () => {
      if (element) {
        element.removeEventListener('touchmove', handleTouchStart);
      }
    };
  }, [ref]);
}

export default usePreventTouchNavigation;
