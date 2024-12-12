export function extractTextFromTxt(file) {
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onload = function () {
      resolve(reader.result.trim());
    };

    reader.onerror = function () {
      reject(reader.error);
    };

    reader.readAsText(file);
  });
}
