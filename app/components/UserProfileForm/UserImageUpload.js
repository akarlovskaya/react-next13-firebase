import { useState } from "react";
import { auth, storage, STATE_CHANGED } from "../../lib/firebase.js";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import Loader from "../Loader.js";
import Image from "next/image";

const UserImageUpload = ({ setPhotoURL }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState(null);

  // Creates a Firebase Upload Task
  const uploadFile = async (e) => {
    // Get the file
    const file = Array.from(e.target.files)[0];
    const extension = file.type.split("/")[1];

    if (file) {
      setPreview(URL.createObjectURL(file));
    }

    // Makes reference to the storage bucket location
    const fileRef = ref(
      storage,
      `uploads/${auth.currentUser.uid}/${Date.now()}.${extension}`
    );
    setUploading(true);

    // Starts the upload
    const task = uploadBytesResumable(fileRef, file);

    // Listen to updates to upload task
    task.on(STATE_CHANGED, (snapshot) => {
      const pct = (
        (snapshot.bytesTransferred / snapshot.totalBytes) *
        100
      ).toFixed(0);
      setProgress(pct);
    });

    // Get downloadURL AFTER task resolves (Note: this is not a native Promise)
    task
      .then((d) => getDownloadURL(fileRef))
      .then((url) => {
        setPhotoURL(url);
        setUploading(false);
      });
  };

  return (
    <div className="mb-4 flex flex-col items-center">
      <Loader show={uploading} />
      {uploading && <p className="text-blue-600 font-medium">{progress}%</p>}

      {!uploading && (
        <>
          <label
            htmlFor="avatarImage"
            className="flex flex-col items-center justify-center w-40 h-40 border-2 border-dashed border-gray-300 rounded-full cursor-pointer hover:border-blue-500 transition-all"
          >
            {preview ? (
              <Image
                src={preview}
                alt="Avatar Preview"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <div className="flex flex-col items-center text-gray-500">
                <span className="text-2xl">📸</span>
                <p className="text-sm font-medium mt-1">Upload Image</p>
              </div>
            )}
            <input
              type="file"
              id="avatarImage"
              onChange={uploadFile}
              accept="image/x-png,image/gif,image/jpeg"
              className="hidden"
            />
          </label>

          <p className="mt-2 text-sm text-gray-500">
            Accepted formats:{" "}
            <span className="font-medium">.jpg, .png, .jpeg</span>
          </p>
        </>
      )}
    </div>
  );
};

export default UserImageUpload;
