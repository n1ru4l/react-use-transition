# @n1ru4l/react-use-transition

## 0.4.3

### Patch Changes

- 2f1a958: BREAKING: switch out tuple return types.

  ```diff
  - const [showLoadingIndicator, cachedData] = useTransition()
  + const [cachedData, showLoadingIndicator] = useTransition()
  ```

## 0.4.2

### Patch Changes

- 001dc61: fix publish script

## 0.4.1

### Patch Changes

- db294c0: Include README.md in published package.
