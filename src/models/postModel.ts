import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IPost extends Document {
  title: string;
  slug: string;
  content: string;
  author: mongoose.Schema.Types.ObjectId;
  category: 'wellbeing'| 'mindfulness' | 'self-care' | 'stress-management' | 'therapy' | 'resilience' | 'other';
  published: boolean;
}

const PostSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: {
        type: String,
        enum: ['wellbeing', 'mindfulness', 'self-care', 'stress-management', 'therapy', 'resilience', 'other'],
        required: true,
      },    
    published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Post = models.Post || model<IPost>('Post', PostSchema);
export default Post;