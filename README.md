# @n1ru4l/react-use-transition

Suspense like transitions without experimental react features today. Totally framework agnostic.

Use it together with your favorite GraphQL client such as `apollo`, `relay`, `urql` or any other data fetching library.

# Usage

```tsx
import * as React from "react";
import { unstable_batchedUpdates } from "react-dom"; // or react-native
import { createUseTransition } from "@n1ru4l/react-use-transition";

import { useQuery } from "your-fetching-library-of-choice";

const useTransition = createUseTransition(unstable_batchedUpdates);

const DataFetchingComponent = ({ postId }) => {
  const props = useQuery("/foo/:postId", { postId });
  const isLoading = !props.error && !props.data; // Depending on the library it could also be props.isLoading :)
  const [cachedProps, showLoadingIndicator] = useTransition(props, isLoading);

  return (
    <>
      {showLoadingIndicator ? <Spinner /> : null}
      {cachedProps ? (
        cachedProps.error ? (
          <ErrorRenderer error={cachedProps.error} />
        ) : (
          <PostRenderer post={props.data} />
        )
      ) : null}
    </>
  );
};
```
