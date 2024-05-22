import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashProfile from "../components/DashProfile";
import DashSidebar from "../components/DashSidebar";
import DashPosts from "../components/DashPosts";
import DashUsers from "../components/DashUsers";
import DashComments from "../components/DashComments";
import DashboardComp from "../components/DashboardComp";

const Dashboard = () => {
  const location = useLocation();
  const [tab, settab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromURL = urlParams.get("tab");
    if (tabFromURL) {
      settab(tabFromURL);
    }
  }, [location.search]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
        <DashSidebar />
      </div>

      {/* PROFILE  */}
      {tab === "profile" && <DashProfile />}

      {/* POSTS */}
      {tab === "posts" && <DashPosts />}

      {/* USERS */}
      {tab === "users" && <DashUsers />}

      {/* COMMENTS */}
      {tab === "comments" && <DashComments />}

      {/* DASHBOARD COMPONENT */}
      {tab === "dash" && <DashboardComp />}
    </div>
  );
};

export default Dashboard;
