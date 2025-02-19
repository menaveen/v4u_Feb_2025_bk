import mongoose from 'mongoose';

const Schema = mongoose.Schema;

// Define the schema for the user collection
const UserSchema = new Schema({
    id: 
    { 
        type: String, 
        required: true 
    },
    companyId: 
    { 
        type: String, 
        required: true 
    },
    email: 
    { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: 
    { 
        type: String ,
        required: true,
    },
    createdAt: { type: Date, default: Date.now },
  // Add other fields as needed
});

// Create the User model
const User = mongoose.model('User', UserSchema);

export default User;
