import { useEffect, useRef } from "react";

const debounce = (func: (...args: unknown[]) => void, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (...args: unknown[]) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

export const useInfiniteScroll = (fetchData: () => Promise<void>) => {
  const isFetchingRef = useRef(false);
  const fetchDataRef = useRef(fetchData);
  
  // Update the ref when fetchData changes
  useEffect(() => {
    fetchDataRef.current = fetchData;
  }, [fetchData]);

  const handleScroll = debounce(async () => {
    if (isFetchingRef.current) return;
    const bottom =
      Math.ceil(window.innerHeight + window.scrollY) >=
      document.documentElement.scrollHeight - 200;
    if (bottom) {
      isFetchingRef.current = true;
      fetchDataRef.current().finally(() => {
        isFetchingRef.current = false;
      });
    }
  }, 300);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);
};