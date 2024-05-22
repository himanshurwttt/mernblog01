import { Alert, Button, Modal, TextInput } from "flowbite-react";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateFailure,
  updateStart,
  updateSuccess,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutSuccess,
} from "../redux/user/userSlice";
import { Link } from "react-router-dom";

const DashProfile = () => {
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileURL, setImageFileURL] = useState(null);
  const [imageFileUploadingProgress, setimageFileUploadingProgress] =
    useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModel, setShowModel] = useState(false);
  const [formData, setFormData] = useState({});
  const filePickerRef = useRef();
  const dispatch = useDispatch();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileURL(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    setImageFileUploading(true);
    setImageFileUploadError(false);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    // service firebase.storage {
    //   match /b/{bucket}/o {
    //     match /{allPaths=**} {
    //       allow read;
    //       allow write : if
    //       request.resource.size < 2 * 1024 * 1024 &&
    //       request.resource.contentType.matches( 'image/.*')
    //      }
    //   }
    // }

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setimageFileUploadingProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError(
          `The file can't get upload ( The file size must  less then 2mb)`
        );
        setimageFileUploadingProgress(null);
        setImageFile(null);
        setImageFileURL(null);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileURL(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
          setImageFileUploading(false);
        });
      }
    );
  };

  const handleOnChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    if (Object.keys(formData).length === 0) {
      setUpdateUserError("No update changes made");
      return;
    }
    if (imageFileUploading) {
      setUpdateUserError("Please wait for image to upload");
      return;
    }
    try {
      setUpdateUserError(null);
      setUpdateUserSuccess(null);
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "put",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("Users profile updated successfully");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setImageUploadSuccess(false);
      setUpdateUserError(error);
    }
  };

  const handleDeleteAccount = async () => {
    setShowModel(false);
    dispatch(deleteUserStart());
    try {
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "delete",
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      }
      dispatch(signOutSuccess());
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="p-3 w-full max-w-lg mx-auto">
      <h1 className="w-full text-center font-semibold my-7 text-3xl">
        Profile
      </h1>
      <form className="flex flex-col gap-5" onSubmit={handleOnSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />
        <div
          className="self-center w-32 h-32 overflow-hidden cursor-pointer"
          onClick={() => filePickerRef.current.click()}
        >
          <img
            src={imageFileURL || currentUser.profilePicture}
            alt="user"
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
              imageFileUploadingProgress &&
              imageFileUploadingProgress < 100 &&
              "opacity-60"
            }`}
          />
        </div>
        {imageFileUploadError && (
          <Alert color={"failure"}>{imageFileUploadError}</Alert>
        )}
        <TextInput
          type="text"
          placeholder="username"
          id="username"
          defaultValue={currentUser.username}
          onChange={handleOnChange}
        />
        <TextInput
          type="email"
          placeholder="email"
          id="email"
          defaultValue={currentUser.email}
          className="text-center "
          onChange={handleOnChange}
        />
        <TextInput
          type="text"
          placeholder="password"
          id="password"
          className="text-center "
          onChange={handleOnChange}
        />
        <Button
          type="submit"
          gradientDuoTone={"purpleToBlue"}
          outline
          disabled={loading || imageFileUploading}
        >
          {loading ? "Loading..." : "Update"}
        </Button>
        {currentUser.isAdmin && (
          <Link to={"/create-post"}>
            <Button
              gradientDuoTone={"purpleToPink"}
              className="w-full"
              type="button"
              outline
            >
              Create a post
            </Button>
          </Link>
        )}
      </form>
      <div className="text-red-600 flex justify-between mt-5 font-semibold">
        <span
          className="cursor-pointer"
          onClick={() => {
            setShowModel(true);
          }}
        >
          Delete Account
        </span>
        <span onClick={handleSignOut} className="cursor-pointer">
          Sign Out
        </span>
      </div>
      {updateUserSuccess && (
        <Alert className="mt-5" color={"success"}>
          {updateUserSuccess}
        </Alert>
      )}
      {updateUserError && (
        <Alert color="failure" className="mt-5">
          {updateUserError}
        </Alert>
      )}
      {error && (
        <Alert color="failure" className="mt-5">
          {error}
        </Alert>
      )}

      <Modal
        show={showModel}
        popup
        size={"md"}
        onClose={() => setShowModel(false)}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="w-14 h-14 mx-auto  text-gray-600 dark:text-gray-200 mb-4" />
            <h3 className="text-lg mx-1 font-semibold mb-6 text-gray-700 dark:text-gray-300">
              Are you sure you want to delete your Account !
            </h3>
            <div className="flex justify-center gap-8 my-2">
              <Button color={"success"} onClick={handleDeleteAccount}>
                Yes i'm sure
              </Button>
              <Button color={"failure"} onClick={() => setShowModel(false)}>
                No, cancel{" "}
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DashProfile;
