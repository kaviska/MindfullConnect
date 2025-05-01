"use client";
import { useEffect, useState } from "react";
import Pusher from "pusher-js";

export default function Home() {
  const [notifications, setNotifications] = useState<
    { id: number; message: string; read: boolean }[]
  >([]);

  useEffect(()=>{
    const fetchNotifications = async () => {
      const response = await fetch("http://localhost:3000/api/notification-temp", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setNotifications(data);
    } 
    fetchNotifications()
  }, [])
 

  useEffect(() => {
    const pusher = new Pusher("26d23c8825bb9eac01f6", {
      cluster: "ap2",
    });

    Pusher.logToConsole = true;

    const channel = pusher.subscribe("notifications");
    interface NotificationData {
      id: number;
      message: string;
    }

    channel.bind("new-notification", function (data: NotificationData) {
      setNotifications((prev) => [
        ...prev,
        { id: data.id, message: data.message, read: false },
      ]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      <ul className="space-y-4">
        {notifications.map((notification) => (
          <li
            key={notification.id}
            className={`p-4 rounded-lg shadow-md ${
              notification.read ? "bg-gray-300" : "bg-white"
            }`}
          >
            <div className="flex justify-between items-center">
              <span
                className={`text-lg ${
                  notification.read ? "text-gray-500" : "text-black"
                }`}
              >
                {notification.message}
              </span>
              {!notification.read && (
                <button
                  onClick={() => markAsRead(notification.id)}
                  className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Mark as Read
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}