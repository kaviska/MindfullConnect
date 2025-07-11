"use client";

import * as React from "react";
import { useState,useEffect } from "react";
import { createTheme } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { NextAppProvider } from "@toolpad/core/nextjs";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import BellIcon from "@mui/icons-material/Notifications";
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import EngineeringIcon from '@mui/icons-material/Engineering';
import { Suspense } from "react";
import CategoryIcon from '@mui/icons-material/Category';
import Badge from "@mui/material/Badge";
import { ToastProvider } from "@/contexts/ToastContext"; // Adjust the import path if necessary
import Pusher from "pusher-js";
import '../globals.css'

// Define the theme
const demoTheme = createTheme({
  colorSchemes: { light: true, dark: false },
  breakpoints: {
    values: { xs: 0, sm: 600, md: 600, lg: 1200, xl: 1536 },
  },
});



function TopNav() {
  const [loading, setLoading] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    // Fetch initial notification count
    const fetchNotificationCount = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/notification-temp?user_id=68120f0abdb0b2d10474be42"
        );
        const data = await response.json();
        const unreadCount = data.filter((notification: any) => !notification.is_read).length;
        setNotificationCount(unreadCount);
      } catch (error) {
        console.error("Error fetching notification count:", error);
      }
    };

    fetchNotificationCount();

    // Set up Pusher for real-time updates
    const pusher = new Pusher("26d23c8825bb9eac01f6", {
      cluster: "ap2",
    });

    const channel = pusher.subscribe("notifications");
    channel.bind("new-notification", (data: any) => {
      setNotificationCount((prevCount) => prevCount + 1);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  return (
    <div className="flex items-center gap-5 mr-20 my-10">
      {loading ? (
        <BellIcon color="action" />
      ) : (
        <Badge badgeContent={notificationCount} color="primary">
          <BellIcon
            color="action"
            className="cursor-pointer"
            onClick={() => {
              window.location.href = "http://localhost:3000/counsellor/notifications";
            }}
          />
        </Badge>
      )}
    </div>
  );
}


// Main dashboard component
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [selectedPage, setSelectedPage] = useState("dashboard"); // Default page

  // Define navigation menu with click handlers
  const NAVIGATION = [
    { kind: "header", title: "Main items" },
    {
      segment: "dashboard",
      title: "Dashboard",
      icon: <DashboardIcon onClick={() => setSelectedPage("dashboard")} />,
    },
    {
      segment: "manage-profile",
      title: "Manage Profile",
      icon: <EngineeringIcon onClick={() => setSelectedPage("manage-profile")} />,
    },
    {
      segment: "sessions",
      title: "Sessions",
      icon: <CategoryIcon onClick={() => setSelectedPage("sessions")} />,
      children: [
        {
          segment: "",
          title: "Total Sessions",
          icon: <AddIcon onClick={() => setSelectedPage("counsellor/goals")} />,
        },
        {
          segment: "upcoming-sessions",
          title: "Upcoming Sessions",
          icon: <VisibilityIcon onClick={() => setSelectedPage("counsellor/goals/view")} />,
        },
        {
          segment: "previous-sessions",
          title: "Previous Sessions",
          icon: <DashboardIcon onClick={() => setSelectedPage("counsellor/goals")} />,
        },
      ],
    },
    {
      segment: "messages",
      title: "Messages",
      icon: <VisibilityIcon onClick={() => setSelectedPage("messages")} />,
    },
    {
      segment: "counsellor/goals",
      title: "Progress Tracking",
      icon: <CategoryIcon onClick={() => setSelectedPage("counsellor/goals")} />,
      children: [
        {
          segment: "",
          title: "Add",
          icon: <AddIcon onClick={() => setSelectedPage("counsellor/goals")} />,
        },
        {
          segment: "list",
          title: "List",
          icon: <VisibilityIcon onClick={() => setSelectedPage("counsellor/goals/view")} />,
        },
      ],
    },
    {
      segment: "feedback",
      title: "Feedback",
      icon: <DashboardIcon onClick={() => setSelectedPage("feedback")} />,
    },
    {
      segment: "patient-details",
      title: "Patient Details",
      icon: <EngineeringIcon onClick={() => setSelectedPage("patient-details")} />,
    },
    {
      segment: "manage",
      title: "Manage Blogs",
      icon: <CategoryIcon onClick={() => setSelectedPage("manage")} />,
      children: [
        {
          segment: "read-blogs",
          title: "Read Blogs",
          icon: <VisibilityIcon onClick={() => setSelectedPage("manage/read-blogs")} />,
        },
        {
          segment: "my-blogs",
          title: "My Blogs",
          icon: <DashboardIcon onClick={() => setSelectedPage("manage/my-blogs")} />,
        },
        {
          segment: "write-blog",
          title: "Write a Blog",
          icon: <AddIcon onClick={() => setSelectedPage("manage/write-blog")} />,
        },
      ],
    },
  ];

  return (
    <html lang="en">
      <body>
        <ToastProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <NextAppProvider
              navigation={NAVIGATION as any}
              branding={{
                logo: <img src="/logo.png" alt="MUI logo" className="md:block hidden" />,
                title: "MindfullConnect",
                homeUrl: "/toolpad/core/introduction",
              }}
              theme={demoTheme}
            >
              <DashboardLayout
                slots={{
                  toolbarAccount: TopNav,
                }}
                sx={{ ".MuiStack-root": { padding: "0px 10px" } }}
              >
                <div className="bg-blue-50 min-h-full p-10">{children}</div>
              </DashboardLayout>
            </NextAppProvider>
          </Suspense>
        </ToastProvider>
      </body>
    </html>
  );
}
