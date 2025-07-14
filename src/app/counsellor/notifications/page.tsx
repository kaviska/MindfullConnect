"use client";
import { useEffect, useState } from "react";
import Pusher from "pusher-js";
import { Bell, Check, Trash2, AlertCircle, Clock, Filter } from "lucide-react";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<
    { id: string; message: string; read: boolean; timestamp?: string; type?: string }[]
  >([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  useEffect(() => {
    const fetchNotifications = async () => {
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
      setNotifications(data);
    };
    fetchNotifications();
  }, []);

  useEffect(() => {
    const pusher = new Pusher("26d23c8825bb9eac01f6", {
      cluster: "ap2",
    });

    Pusher.logToConsole = true;

    const channel = pusher.subscribe("notifications");
    interface NotificationData {
      id: string;
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

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'read') return notification.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = async (id: string) => {
    try {
      console.log("Marking as read:", id); // Debug log
      const response = await fetch("http://localhost:3000/api/notification-temp", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, is_read: true }),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to mark as read: ${response.statusText}`);
      }
  
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id ? { ...notification, read: true } : notification
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };
  
  const deleteNotification = async (id: string) => {
    try {
      console.log("Deleting notification:", id); // Debug log
      const response = await fetch(
        `http://localhost:3000/api/notification-temp?id=${id}`,
        {
          method: "DELETE",
        }
      );
  
      if (!response.ok) {
        throw new Error(`Failed to delete notification: ${response.statusText}`);
      }
  
      setNotifications((prev) =>
        prev.filter((notification) => notification.id !== id)
      );
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const markAllAsRead = async () => {
    const unreadNotifications = notifications.filter(n => !n.read);
    for (const notification of unreadNotifications) {
      await markAsRead(notification.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Bell className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
              <p className="text-gray-600">
                {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <Check size={16} />
                Mark All Read
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-4">
          <Filter size={18} className="text-gray-500" />
          <div className="flex gap-2">
            {[
              {
                key: 'all',
                label: 'All',
                count: notifications.length
              },
              {
                key: 'unread',
                label: 'Unread',
                count: unreadCount
              },
              {
                key: 'read',
                label: 'Read',
                count: notifications.length - unreadCount
              }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as 'all' | 'unread' | 'read')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  filter === tab.key
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-6 transition-colors duration-200 ${
                !notification.read ? 'bg-blue-50 border-l-4 border-blue-500' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                    <AlertCircle size={16} className="text-gray-400" />
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock size={12} />
                      {notification.timestamp || 'Just now'}
                    </span>
                  </div>
                  <p className={`text-base ${!notification.read ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                    {notification.message}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      <Check size={14} />
                      Mark Read
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors duration-200"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No notifications found</p>
            <p className="text-gray-400 text-sm">
              {filter === 'all' ? 'You\'re all caught up!' : `No ${filter} notifications`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}