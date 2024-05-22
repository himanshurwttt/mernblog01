import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Modal, Table } from "flowbite-react";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const DashPosts = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [userPost, setUserPost] = useState([{}]);
  const [showMore, setShowMore] = useState(true);
  const [showModel, setShowModel] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`);
        const data = await res.json();
        if (res.ok) {
          setUserPost(data.posts);
          if (data.posts.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        return;
      }
    };
    if (currentUser.isAdmin) {
      fetchPosts();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    try {
      const startIndex = userPost.length;
      const res = await fetch(
        `/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`
      );
      const data = await res.json();

      if (res.ok) {
        setUserPost((prev) => [...prev, ...data.posts]);
        if (data.posts.length <= 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeletePost = async () => {
    console.log("contured delete functionality");
    setShowModel(false);
    try {
      const res = await fetch(
        `/api/post/deletepost/${postIdToDelete}/${currentUser._id}`,
        {
          method: "DELETE",
        }
      );
      console.log("api called");
      const data = await res.json();
      console.log("delete started");
      if (!res.ok) {
        console.log(data.message);
        console.log("deleting canceled");
      } else {
        setUserPost((prev) =>
          prev.filter((post) => post._id !== postIdToDelete)
        );
        if (res.ok) {
          console.log("delete done");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="table-auto overflow-x-scroll  scrollbar md:mx-auto p-3 scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.isAdmin && userPost.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Updated</Table.HeadCell>
              <Table.HeadCell>Post Image</Table.HeadCell>
              <Table.HeadCell>Post Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
            </Table.Head>
            {userPost.map((post) => (
              <Table.Body key={post._id}>
                <Table.Row className="bg-white dark:bg-gray-700 dark:border-gray-700">
                  <Table.Cell>
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post.slug}`}>
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-20 h-10 object-cover bg-gray-500"
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className="font-medium text-gray-900 dark:text-gray-300"
                      to={`/post/${post.slug}`}
                    >
                      {post.title}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{post.category}</Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModel(true);
                        setPostIdToDelete(post._id);
                      }}
                      className="font-bold md:font-medium hover:underline dark:text-red-500  text-red-600 cursor-pointer"
                    >
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      to={`/update-post/${post._id}`}
                      className="text-teal-600 dark:text-teal-400 font-bold sm:font-medium"
                    >
                      Edit
                    </Link>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full text-teal-500 self-center text-sm py-7"
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <p>You have no post created yet</p>
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
              <Button color={"success"} onClick={handleDeletePost}>
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
export default DashPosts;
