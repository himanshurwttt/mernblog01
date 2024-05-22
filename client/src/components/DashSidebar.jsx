import React, { useEffect, useState } from "react";
import { Sidebar } from "flowbite-react";
import {
  HiArrowSmRight,
  HiChartPie,
  HiDocumentText,
  HiOutlineUserGroup,
  HiUser,
} from "react-icons/hi";
import { MdOutlineComment } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import { signOutSuccess } from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";

const DashSidebar = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const location = useLocation();
  const [tab, settab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromURL = urlParams.get("tab");
    if (tabFromURL) {
      settab(tabFromURL);
    }
  }, [location.search]);

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
    <Sidebar className="w-full md:w-56 ">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex sm:flex-col flex-col   gap-1">
          <Link to={"/dashboard?tab=dash"}>
            <Sidebar.Item
              active={tab === "dash"}
              icon={HiChartPie}
              labelColor={"dark"}
              as="div"
              className="w-full"
            >
              Dashboard
            </Sidebar.Item>
          </Link>
          <Link to={"/dashboard?tab=profile"}>
            <Sidebar.Item
              active={tab === "profile"}
              icon={HiUser}
              label={currentUser.isAdmin ? "Admin" : "User"}
              labelColor={"dark"}
              as="div"
              className="w-full"
            >
              Profile
            </Sidebar.Item>
          </Link>
          {currentUser.isAdmin && (
            <Link to={"/dashboard?tab=posts"}>
              <Sidebar.Item
                active={tab === "posts"}
                icon={HiDocumentText}
                labelColor="dark"
                as="div"
                className="w-full"
              >
                Posts
              </Sidebar.Item>
            </Link>
          )}
          {currentUser.isAdmin && (
            <Link to={"/dashboard?tab=users"}>
              <Sidebar.Item
                active={tab === "users"}
                icon={HiOutlineUserGroup}
                labelColor="dark"
                as={"div"}
                className="w-full"
              >
                users
              </Sidebar.Item>
            </Link>
          )}
          {currentUser.isAdmin && (
            <Link to={"/dashboard?tab=comments"}>
              <Sidebar.Item
                active={tab === "comments"}
                icon={MdOutlineComment}
                labelColor="dark"
                as={"div"}
                className="w-full"
              >
                Comments
              </Sidebar.Item>
            </Link>
          )}

          <Sidebar.Item
            icon={HiArrowSmRight}
            className="cursor-pointer"
            onClick={handleSignOut}
          >
            signout
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};
export default DashSidebar;
