import mongoose from 'mongoose';

export interface IUser {
  username: string;
  password: string;
}

const userSchema = new mongoose.Schema<IUser>({
  username: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
});

export const User = mongoose.model<IUser>('User', userSchema);
