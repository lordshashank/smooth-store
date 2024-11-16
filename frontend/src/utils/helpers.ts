export const capitalizeFirstLetter = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

// Utility function to convert miner ID from string to bytes
export const convertMinerIdToBytes = (input: string): string => {
  // Step 1: Extract the numeric part from the string
  const numericPart = input.slice(1);

  // Step 2: Convert the numeric part to an integer
  const number = parseInt(numericPart, 10);

  // Step 3: Convert the integer to a hexadecimal string
  let hexString = number.toString(16);

  // Step 4: Ensure the hexadecimal string is padded to 8 characters
  hexString = hexString.padStart(8, "0");

  // Step 5: Add the '0x' prefix
  return `0x${hexString}`;
};

// Utility function to validate miner ID format
export const isValidMinerId = (minerId: string): boolean => {
  const minerIdRegex = /^t0\d+$/;
  return minerIdRegex.test(minerId);
};

export const convertBytesToMinerId = (bytes: `0x${string}`): string => {
  // Remove '0x' prefix and convert to number
  const num = parseInt(bytes.slice(2), 16);
  // Format as 't0' followed by the number
  return `t0${num}`;
};
