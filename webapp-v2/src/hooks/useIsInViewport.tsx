import { useState, useEffect } from 'react';

type UseIsInViewportProps = {
  element: React.MutableRefObject<HTMLElement | null>;
  rootMargin?: string;
};

const useIsInViewport = (props: UseIsInViewportProps) => {
  const { element, rootMargin = '0px' } = props;
  const [isVisible, setState] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState(entry.isIntersecting);
          observer.unobserve(element.current!);
        }
      },
      { rootMargin }
    );

    element.current && observer.observe(element.current);
  }, []);

  return isVisible;
};

export default useIsInViewport;
