import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../config/firebase";

const uploadFile = async (file) => {
  try {
    // Tạo tên file ngẫu nhiên để tránh trùng lặp
    const timestamp = new Date().getTime();
    const randomString = Math.random().toString(36).substring(2, 8);
    const fileName = `${timestamp}-${randomString}-${file.name}`;

    const storageRef = ref(storage, `avatars/${fileName}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

export default uploadFile;
