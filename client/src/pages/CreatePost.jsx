import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import { app } from "../firebase";
import { useNavigate } from "react-router-dom";

export const CreatePost = () => {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadProgressError, setImageUploadProgressError] =
    useState(null);
  const [formdata, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const navigate = useNavigate();
  const [deleteUploadedImage, setDeleteUploadImage] = useState(false);

  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadProgressError("Please select a file to upload");
        return;
      }
      setImageUploadProgressError(null);

      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;

      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
          setDeleteUploadImage(false);
        },
        (error) => {
          console.error("Upload error:", error);
          setImageUploadProgressError('image upload failed "please try again"');
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadProgressError(null);
            setFormData({ ...formdata, image: downloadURL });
            setDeleteUploadImage(true);
          });
        }
      );
    } catch (error) {
      console.error("Image upload failed:", error);
      setImageUploadProgress(null);
      setDeleteUploadImage(false);
      setImageUploadProgressError("Image upload failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/post/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formdata),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }

      if (res.ok) {
        setPublishError(null);
        navigate(`/post/${data.slug}`);
      }
    } catch (error) {
      setPublishError("Something went wrong");
    }
  };

  return (
    <div className="max-w-3xl min-h-screen p-3 mx-auto">
      <h1 className="my-7 font-bold text-4xl text-center">Create a Post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Headline"
            id="title"
            required
            className="flex-1"
            onChange={(e) =>
              setFormData({ ...formdata, title: e.target.value })
            }
          />
          <Select
            onChange={(e) =>
              setFormData({ ...formdata, category: e.target.value })
            }
          >
            <option value={"uncategorized"}>Select a category</option>
            <option value={"javascript"}>javascript</option>
            <option value={"python"}>python</option>
            <option value={"react js"}>react js</option>
            <option value={"next js"}>next js</option>
            <option value={"c"}>c</option>
            <option value={"c++"}>c++</option>
            <option value={"ruby"}>ruby</option>
            <option value={"html"}>html</option>
            <option value={"css"}>css</option>
          </Select>
        </div>
        <div className="flex flex-col items-center gap-4 border-teal-600 border-dotted border-4 p-3 sm:flex-row  justify-between">
          <FileInput
            className="w-full max-w-[100%] sm:max-w-[60%] "
            type="file"
            accept="image/*"
            onChange={(e) => {
              setFile(e.target.files[0]);
            }}
          />
          <div className="flex flex-between gap-3 w-full max-w-[40%]:">
            <Button
              gradientDuoTone={"purpleToPink"}
              size={"sm"}
              outline
              onClick={handleUploadImage}
              disabled={imageUploadProgress}
              className="w-full max-w-[100%] sm:max-w-[60%]"
            >
              {imageUploadProgress ? "Uploading..." : "Upload Image"}
            </Button>
            <Button
              className="w-full max-w-[100%] sm:max-w-[60%]"
              gradientDuoTone={"purpleToPink"}
              size={"sm"}
              outline
              onClick={() => setFormData({ ...formdata, image: null })}
              disabled={!deleteUploadedImage}
            >
              Delete
            </Button>
          </div>
        </div>
        {imageUploadProgressError && (
          <Alert color={"failure"}>
            <span>{imageUploadProgressError}</span>{" "}
          </Alert>
        )}
        {formdata.image && (
          <img
            src={formdata.image}
            alt="upload"
            className="w-full h-72 object-cover"
          />
        )}
        <ReactQuill
          theme="snow"
          placeholder="write something"
          className="h-64 mb-12"
          required
          onChange={(value) => setFormData({ ...formdata, content: value })}
        />
        {publishError && <Alert color={"failure"}>{publishError}</Alert>}

        <Button
          disabled={imageUploadProgress}
          type="submit"
          gradientDuoTone={"purpleToBlue"}
          outline
        >
          {" "}
          submit
        </Button>
      </form>
    </div>
  );
};
