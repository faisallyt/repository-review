"use client";
import React, { useEffect, useState } from "react";
import {
  Sidebar,
  SidebarBody,
  SidebarLink,
} from "../components/ui/SideBar.jsx";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
// import Link from "next/link";
import { motion } from "framer-motion";
// import Image from "next/image";
import { cn } from "../lib/utils.js";
import { NavLink } from "react-router-dom";
import logo from "../assets/repo_review-logo.png";
import axios from "axios";
const backend_url =
  import.meta.env.VITE_APP_BACKEND_URI || "http://localhost:8000";

const SidebarDemo = () => {
  const [userData, setUserData] = useState(null);
  const [followers, setFollowers] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [followersUrl, setFollowersUrl] = useState(null);
  const [following, setFollwing] = useState(null);
  const [repository, setRepository] = useState(null);

  //   const getFollowers = async (url) => {
  //     if (accessToken) {
  //       try {
  //         console.log(accessToken);
  //         console.log(url);
  //         const response = await axios.get(url, {
  //           headers: { Authorization: `Bearer ${accessToken}` },
  //         });

  //         setFollowers(response?.data?.length);
  //         console.log(response?.data?.length);
  //       } catch (error) {
  //         console.error("API error:", error);
  //       }
  //     }
  //   };

  const apiCaller = async (url, type, token) => {
    if (token) {
      try {
        console.log(token);
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response?.data?.length);
        switch (type) {
          case "followers":
            setFollowers(response?.data?.length);
            break;
          case "following":
            setFollwing(response?.data?.length);
            break;
          case "repository":
            setRepository(response?.data?.length);
            break;
          default:
            console.error("Invalid type provided");
            break;
        }
      } catch (error) {
        console.error("API error:", error);
      }
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        console.log("Access token:", token); // Log to check if token exists
        if (token) {
          setAccessToken(token); // Store the token in state if needed elsewhere
          const response = await axios.get(
            `${backend_url}/api/v1/getUserInfo`,
            {
              headers: { Authorization: "Bearer " + token },
            }
          );
          console.log("API response:", response); // Log to check the API response
          if (response?.data?.success) {
            setUserData(response?.data?.user);
            apiCaller(response?.data?.user?.followers_url, "followers", token);
            const followingUrl =
              response?.data?.user?.following_url.split("{")[0];
            apiCaller(followingUrl, "following", token);
            apiCaller(response?.data?.user?.repos_url, "repository", token);
          }
        } else {
          console.log("No access token found in localStorage.");
        }
      } catch (error) {
        console.error("API error:", error); // Log the error
      }
    };
    fetchUserData();
  }, []);

  const links = [
    {
      label: "Repo Review",
      href: "#",
      icon: (
        <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Profile",
      href: "#",
      icon: (
        <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Settings",
      href: "#",
      icon: (
        <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Logout",
      href: "#",
      icon: (
        <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];
  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        " rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 h-screen  mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden"
        // for your use case, use `h-screen` instead of `h-[60vh]`
      )}>
      <Sidebar open={open} setOpen={setOpen} animate={true}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <>
              <Logo />
            </>
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: userData?.login || "user",
                href: "#",
                icon: (
                  <img
                    src={
                      userData?.avatar_url
                        ? userData.avatar_url
                        : "https://assets.aceternity.com/manu.png"
                    }
                    className="h-7 w-7 flex-shrink-0 rounded-full"
                    alt="Avatar"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <Dashboard
        userData={userData}
        followers={followers}
        following={following}
        repository={repository}
      />
    </div>
  );
};

export const Logo = () => {
  return (
    <NavLink
      href="#"
      className="font-normal flex space-x-6 items-center text-sm text-black py-1 relative z-20">
      <img src={logo} alt="" className="w-[1.2rem]" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre">
        Github Reviewer
      </motion.span>
    </NavLink>
  );
};

export const LogoIcon = () => {
  return (
    <NavLink
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20">
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </NavLink>
  );
};

// Dummy dashboard component with content
const Dashboard = ({ userData, followers, following, repository }) => {
  return (
    <div className="flex flex-1">
      <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">
        {/* Four boxes showing user information */}
        <div className="flex gap-2 flex-wrap ">
          {/* 1st Box: Hello Username */}
          <div
            key={"username-box"}
            className="h-20 rounded-lg w-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center">
            <div className="flex justify-center gap-12 items-center w-full px-10">
              <img
                src={userData?.avatar_url || ""}
                className="h-12 w-12 flex-shrink-0 rounded-full"
                alt="Avatar"
              />
              <h1 className="text-white text-lg">
                Hello <span>{userData?.login}</span>
              </h1>
            </div>
          </div>

          {/* 2nd Box: Followers */}
          <div
            key={"followers-box"}
            className="h-20 rounded-lg w-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center">
            <h2 className="text-white text-lg">
              Followers: <span>{followers ?? "Loading..."}</span>
            </h2>
          </div>

          {/* 3rd Box: Following */}
          <div
            key={"following-box"}
            className="h-20 rounded-lg w-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center">
            <h2 className="text-white text-lg">
              Following: <span>{following ?? "Loading..."}</span>
            </h2>
          </div>

          {/* 4th Box: Repositories */}
          <div
            key={"repositories-box"}
            className="h-20 rounded-lg w-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center">
            <h2 className="text-white text-lg">
              Repositories: <span>{repository ?? "Loading..."}</span>
            </h2>
          </div>
        </div>

        {/* Additional content can go here */}
        <div className="flex gap-2 flex-1">
          {[...new Array(2)].map((i) => (
            <div
              key={"additional-content" + i}
              className="h-full w-full rounded-lg bg-gray-100 dark:bg-neutral-800 animate-pulse"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SidebarDemo;
