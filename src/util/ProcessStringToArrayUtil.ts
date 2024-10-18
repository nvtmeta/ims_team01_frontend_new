// utils.js
export function ProcessStringToArray(inputString: string) {
  // Split the input string at the comma and trim whitespace from each value
  return inputString.split(",").map((value) => value.trim());
}
