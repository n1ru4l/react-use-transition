import * as React from "react";

/**
 * Create a useTransition hook for a specific react reconciler.
 */
export function createUseTransition(
  /**
   * The unstable_BatchedUpdates function for a specific react-reconciler.
   */
  batchedUpdates = (run: () => void) => run(),
  /**
   * The used setTimeout function for scheduling the timeout after which a loading indicator should be shown.
   * Passing this argument might be handy for testing.
   */
  _setTimeout = setTimeout
) {
  /**
   * Returns a transition state that holds the old value until the loading of the new value has finished.
   */
  return function useTransition<TType>(
    /**
     * The latest data that got loaded.
     */
    data: TType,
    /**
     * Whether a new value is currently being loaded.
     */
    isLoading: boolean,
    /**
     * Threshold after which showing a loading indicator might be useful.
     */
    shouldShowLoadingIndicatorThreshold = 300
  ): [TType, boolean] {
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
        timeout = _setTimeout(() => {
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
      return [data, isLoading];
    }

    return [ref.current.data, ref.current.shouldShowLoadingIndicator];
  };
}
