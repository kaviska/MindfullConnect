import mongoose, { Schema, Document } from 'mongoose';

export interface IAdmin extends Document {
  _id: string;
  email: string;
  password: string;
  isSuperAdmin: boolean;
  firstName: string;
  lastName: string;
  permissions: {
    [section: string]: {
      create?: boolean;
      read?: boolean;
      update?: boolean;
      delete?: boolean;
    };
}
}

const AdminSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  password: String,
  isSuperAdmin: { type: Boolean, default: false },
  permissions: {
  type: Map,
  of: {
    create: { type: Boolean, default: false },
    read: { type: Boolean, default: false },
    update: { type: Boolean, default: false },
    delete: { type: Boolean, default: false },
  },
  default: {},
},
});


export default mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema);