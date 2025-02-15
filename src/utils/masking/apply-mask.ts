const applyMask = (value: string, mask: string, cursorPosition: number) => {
  const numericValue = value.replace(/\D/g, ""); // Remove non-numeric characters
  let maskedValue = "";
  let numericIndex = 0;
  let newCursorPosition = cursorPosition;
  let isFillingNumbers = false;
  // Find first index of 9 in mask
  const firstNumericIndex = mask.indexOf("9");

  for (let i = 0; i < mask.length; i++) {
    if (mask[i] === "9") {
      isFillingNumbers = true;
      if (numericIndex < numericValue.length) {
        maskedValue += numericValue[numericIndex];
        numericIndex++;
      } else {
        break;
      }
    } else {
      maskedValue += mask[i]; // Keep static mask characters (e.g., "-")
      if (numericIndex < numericValue.length || i < cursorPosition) {
        newCursorPosition++;
      }

      // jika karakter statis muncul sebelum angka pertama, kursor tetap bergeser
      if (numericIndex === 0) {
        newCursorPosition++;
      }

      // Jika cursor masih di awal, langsung geser ke tempat angka pertama
      if (cursorPosition === 0 && firstNumericIndex !== -1) {
        newCursorPosition = firstNumericIndex;
      }

      // Posisikan kursor ke angka pertama yang bisa diisi
      if (!isFillingNumbers) {
        newCursorPosition++;
      }
    }
  }

  return { maskedValue, newCursorPosition };
};

const extractRawValue = (maskedValue: string, mask: string) => {
  if(!mask) return maskedValue;
  const maskChars = mask.replace(/\d/g, "").split(""); // Get all non-numeric mask chars
  return maskedValue.split("").filter((char) => !maskChars.includes(char)).join("");
};

export {
  applyMask,
  extractRawValue
}