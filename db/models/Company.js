import mongoose from 'mongoose';

// Define the schema for the user collection id, name description, createdAt
const CompanySchema = new mongoose.Schema({
    id: 
    { 
        type: String, 
        required: true,
        unique: true 
    },
    name: 
    { 
        type: String, 
        required: true
    },
    description: 
    { 
        type: String
    },
    createdAt: { type: Date, default: Date.now },
  // Add other fields as needed
});

// Create the User model
const Company = mongoose.model('Company', CompanySchema);

export default Company;
