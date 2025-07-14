"use client";
import { useState, useEffect } from "react";
import Pusher from "pusher-js";

interface Notification {
  id: string;
  message: string;
  read: boolean;
  timestamp?: string;
  type?: string;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/notification-temp?user_id=68120f0abdb0b2d10474be42",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        setNotifications(data || []);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    const pusher = new Pusher("26d23c8825bb9eac01f6", {
      cluster: "ap2",
    });

    const channel = pusher.subscribe("notifications");
    
    interface NotificationData {
      id: string;
      message: string;
    }

    channel.bind("new-notification", function (data: NotificationData) {
      setNotifications((prev) => [
        { id: data.id, message: data.message, read: false },
        ...prev,
      ]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch("http://localhost:3000/api/notification-temp", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, is_read: true }),
      });

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((notification) =>
            notification.id === id ? { ...notification, read: true } : notification
          )
        );
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    setNotifications
  };
}
