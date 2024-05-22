import { Button, Spinner } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import CommentSection from "../components/CommentSection";
import PostCard from "../components/PostCard";

export default function PostPage() {
  const { postslug } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPost, setRecentPost] = useState(null);

  useEffect(() => {
    try {
      setLoading(true);
      const fetchPost = async () => {
        const res = await fetch(`/api/post/getposts?slug=${postslug}`);
        const data = await res.json();
        if (!res.ok) {
          setError(true);
          setLoading(false);
        }
        if (res.ok) {
          setPost(data.posts[0]);
          setLoading(false);
          setError(false);
        }
      };
      fetchPost();
    } catch (error) {
      setError(true);
      console.log(error);
    }
  }, [postslug]);

  useEffect(() => {
    try {
      const fetchRecentPost = async () => {
        const res = await fetch(`/api/post/getposts?limit=3`);
        const data = await res.json();

        if (res.ok) {
          setRecentPost(data.posts);
        }
      };
      fetchRecentPost();
    } catch (error) {
      console.log(error);
    }
  }, [postslug]);

  if (loading)
    return (
      <div className="min-h-screen text flex justify-center items-center">
        <Spinner size={"xl"} />
      </div>
    );

  return (
    <main className="min-h-screen flex flex-col p-5 max-w-6xl mx-auto">
      <h1 className="text-4xl mx-auto mt-10 text-center max-w-2xl p-3 lg:text-5xl font-serif">
        {post && post.title}
      </h1>
      <Link
        className=" self-center mt-5"
        to={`/search?category=${post && post.category}`}
      >
        <Button color={"gray"} pill size={"xs"}>
          {post && post.category}{" "}
        </Button>
      </Link>
      <img
        src={post && post.image}
        className="mt-10  max-h-[600px]
         object-cover w-full rounded-lg shadow-md"
        alt={post && post.title}
      />
      <div className="p-3 flex justify-between border-b border-slate-500 text-xs max-w-2xl mx-auto w-full">
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span className="italic">
          {post && (post.content.length / 1000).toFixed()} mins read
        </span>
      </div>
      <div
        dangerouslySetInnerHTML={{ __html: post && post.content }}
        className="p-3 max-w-2xl mx-auto w-full post-content"
      ></div>
      <div className="max-w-4xl mx-auto w-full">
        <CallToAction />
      </div>
      {post && <CommentSection postId={post._id} />}

      <div className="flex flex-col justify-center items-center mb-5">
        <h1 className="text-xl mt-5">Recent Articals</h1>
        <div className=" flex  flex-wrap gap-5 mt-5 justify-center">
          {recentPost &&
            recentPost.map((post) => <PostCard key={post._id} post={post} />)}
        </div>
      </div>
    </main>
  );
}
