import { useEffect, useRef } from "react";

type Callback = () => void;

export const useInterval = (callback: Callback, interval: number) => {
  const savedCallback = useRef<Callback | null>(null);
  useEffect(() => {
    savedCallback.current = callback;
  });
  useEffect(() => {
    function tick() {
      if (savedCallback.current) {
        savedCallback.current();
      }
    }

    const id = setInterval(tick, interval);
    return () => clearInterval(id);
  }, [interval]);
};
