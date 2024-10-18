import { storage } from "@/config/configFirebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

export const uploadImage = async (
  e: React.ChangeEvent<HTMLInputElement>,
  folderType: string
): Promise<string> => {
  // 'file' comes from the Blob or File API
  const file = e?.target?.files?.[0];
  const mountainImagesRef = ref(
    storage,
    `${folderType}/${file?.name}_${uuidv4()}`
  );

  if (file) {
    try {
      const snapshot = await uploadBytes(mountainImagesRef, file);
      console.log("snap", snapshot);
      console.log("Uploaded a blob or file!");

      // Get the download URL
      const url = await getDownloadURL(mountainImagesRef);

      return url; // Return the URL
    } catch (error) {
      console.log(error);
      throw error; // Throw the error
    }
  } else {
    throw new Error("No file selected"); // Throw an error if no file is selected
  }
};
