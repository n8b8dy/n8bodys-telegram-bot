export const selectRandomFrom = (arr: Array<unknown>) => {
  return arr[Math.floor(Math.random() * arr.length)]
}
