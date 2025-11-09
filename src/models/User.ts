import mongoose, { Schema, Document, models, Model } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password?: string;
}

const UserSchema: Schema<IUser> = new Schema({
  email: {
    type: String,
    required: [true, 'Please provide an email.'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please fill a valid email address',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password.'],
    minlength: 6,
    select: false,
  },
});


const User: Model<IUser> = models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
