// Import all models to ensure they are registered with Mongoose
import User from "./User";
import Conversation from "./Conversation";
import Message from "./Message";
export { default as Report } from './report'; // ✅ Add this line

// Export models for convenience (optional)
export { User, Conversation, Message };