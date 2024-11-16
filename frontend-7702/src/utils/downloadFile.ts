import CryptoJS from "crypto-js";

async function decryptFileData(file: File, key: string): Promise<File> {
  const reader = new FileReader();
  return await new Promise<File>((resolve, reject) => {
    reader.onload = () => {
      const encryptedData = reader.result as string;
      const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, key);
      const decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);
      const decryptedBlob = new Blob([decryptedData], { type: file.type });
      const decryptedFile = new File([decryptedBlob], file.name, {
        type: file.type,
        lastModified: file.lastModified,
      });
      resolve(decryptedFile);
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

export async function downloadFile(
  cid: string,
  fileName: string,
  userAccount: string
) {
  fileName = "check.txt";
  if (!userAccount) {
    console.error("User is not connected");
    return;
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/serve-file`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileName }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();
    const encryptedFile = new File([blob], fileName, { type: blob.type });

    const decryptedFile = await decryptFileData(encryptedFile, userAccount);

    const url = window.URL.createObjectURL(decryptedFile);
    const a = document.createElement("a");
    a.href = url;
    a.download = decryptedFile.name;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading file:", error);
  }
}
