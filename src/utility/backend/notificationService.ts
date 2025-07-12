import Notification from "@/models/Notification";
import dbConnect from "@/lib/mongodb";
import Pusher from "pusher";

const pusher = new Pusher({
  appId: "1984352",
  key: "26d23c8825bb9eac01f6",
  secret: "48fa0d711601e429f9dd",
  cluster: "ap2",
  useTLS: true,
});

export async function createNotification(data: any) {
  await dbConnect();
  try {
    const notification = new Notification(data);
    await notification.save();
    await pusher.trigger("notifications", "new-notification", {
      message: notification.message,
      user_id: notification.user_id,
      is_read: notification.is_read,
      createdAt: notification.createdAt,
    });
    console.log("Pusher event triggered: new-notification", {
        message: notification.message,
      });

    return { success: true, notification };
  } catch (error) {
    return { success: false, error };
  }
}
