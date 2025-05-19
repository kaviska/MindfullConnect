import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
}

const CategorySchema: Schema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
});

export const Category = models.Category || model<ICategory>('Category', CategorySchema);
export default Category;