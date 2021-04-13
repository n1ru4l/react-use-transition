import * as React from "react";

export function createUseTransition(
  batchedUpdates = (run: () => void) => run()
) {
  /**
   * Returns a transition state that holds the old value until the loading of the new value has finished.
   */
  return function useTransition<TType>(
    data: TType,
    isLoading: boolean,
    shouldShowLoadingIndicatorThreshold = 300
  ): [boolean, TType] {
    const [, triggerStateUpdate] = React.useState(1);
    const ref = React.useRef({
      data,
      previousIsLoading: isLoading,
      shouldShowLoadingIndicator: isLoading,
    });

    React.useEffect(() => {
      if (!isLoading) {
        ref.current.data = data;
        ref.current.shouldShowLoadingIndicator = false;
      }

      let timeout: NodeJS.Timeout | null = null;
      if (ref.current.previousIsLoading !== isLoading && isLoading) {
        timeout = setTimeout(() => {
          batchedUpdates(() => {
            ref.current.shouldShowLoadingIndicator = true;
            triggerStateUpdate((i) => i + 1);
          });
        }, shouldShowLoadingIndicatorThreshold);
      }

      ref.current.previousIsLoading = isLoading;

      return () => {
        if (timeout) {
          clearTimeout(timeout);
        }
      };
    }, [isLoading, triggerStateUpdate, shouldShowLoadingIndicatorThreshold]);

    if (!isLoading) {
      return [isLoading, data];
    }

    return [ref.current.shouldShowLoadingIndicator, ref.current.data];
  };
}
