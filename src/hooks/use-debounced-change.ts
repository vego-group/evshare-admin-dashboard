import { useEffect, useRef } from "react";

import useDebounce from "./use-debounce";

/**
 * Notifies a consumer after a value settles, while always calling the latest
 * callback. The initial value is ignored to avoid duplicate mount requests.
 */
function useDebouncedChange<T>(
  value: T,
  onChange: ((value: T) => void) | undefined,
  delay: number,
) {
  const debouncedValue = useDebounce(value, delay);
  const onChangeRef = useRef(onChange);
  const isInitialRender = useRef(true);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    onChangeRef.current?.(debouncedValue);
  }, [debouncedValue]);
}

export default useDebouncedChange;
