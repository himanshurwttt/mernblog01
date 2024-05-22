import React, { useEffect, useState } from "react";
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
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
export const UpdatePost = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { postId } = useParams();
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadProgressError, setImageUploadProgressError] =
    useState(null);
  const [formdata, setFormData] = useState({
    title: "",
    category: "uncategorized",
    image: null,
    content: "",
  });
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
          setImageUploadProgress(null);
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

  useEffect(() => {
    try {
      const fetchPost = async () => {
        const res = await fetch(`/api/post/getposts?postId=${postId}`);
        const data = await res.json();
        if (!res.ok) {
          console.log(data.message);
          setPublishError(data.message);
          return;
        }
        if (res.ok) {
          setPublishError(null);
          setFormData(data.posts[0]);
        }
      };

      fetchPost();
    } catch (error) {
      console.log(error.message);
    }
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formdata._id) {
      console.log(formdata._id);
    }
    try {
      const res = await fetch(
        `/api/post/updatepost/${postId}/${currentUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formdata),
        }
      );
      console.log("update START");
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        console.log("update failed");
        return;
      }

      if (res.ok) {
        setPublishError(null);
        navigate(`/post/${data.slug}`);
        console.log("update done");
      }
    } catch (error) {
      setPublishError("Something went wrong");
    }
  };
  // console.log(formdata);
  return (
    <div className="max-w-3xl min-h-screen p-3 mx-auto">
      <h1 className="my-7 font-bold text-4xl text-center">Update Post</h1>
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
            value={formdata.title}
          />
          <Select
            value={formdata.category}
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
          <div className="flex flex-between gap-3 w-full max-w-[40%]">
            <Button
              gradientDuoTone={"purpleToPink"}
              size={"sm"}
              outline
              onClick={handleUploadImage}
              disabled={imageUploadProgress !== null}
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
            loading="lazy"
            src={formdata.image}
            alt="Uploaded Image"
            className="w-full h-72 object-cover"
          />
        )}
        <ReactQuill
          theme="snow"
          placeholder="write something"
          className="h-64 mb-12"
          required
          onChange={(value) => setFormData({ ...formdata, content: value })}
          value={formdata.content || ""}
        />
        {publishError && <Alert color={"failure"}>{publishError}</Alert>}

        <Button
          disabled={imageUploadProgress}
          type="submit"
          gradientDuoTone={"purpleToBlue"}
          outline
        >
          Update
        </Button>
      </form>
    </div>
  );
};
