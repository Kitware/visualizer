let accessor = (state) => state;

export default function getState(state) {
  return accessor(state);
}

export function updateVisualizerStateAccessor(fn) {
  accessor = fn;
}
