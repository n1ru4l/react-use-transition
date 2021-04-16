---
"@n1ru4l/react-use-transition": patch
---

BREAKING: switch out tuple return types.

```diff
- const [showLoadingIndicator, cachedData] = useTransition()
+ const [cachedData, showLoadingIndicator] = useTransition()
```
