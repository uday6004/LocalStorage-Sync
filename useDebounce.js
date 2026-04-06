import { useState, useEffect } from 'react';

export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: cancels the timeout if value changes before delay hits
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
