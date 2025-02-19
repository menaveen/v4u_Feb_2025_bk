import mongoose from 'mongoose';
const Schema = mongoose.Schema;
// Define the schema for the user collection id, companyId, title, description, createdAt
const JobSchema = new Schema({
    id: 
    { 
        type: String, 
        required: true,
        unique:true 
    },
    companyId: 
    { 
        type: String, 
        required: true 
    },
    title: 
    { 
        type: String, 
        required: true
    },
    company:{
        type: Schema.Types.ObjectId,
        ref: 'Company',
        required: true,
    },
    description: 
    { 
        type: String ,
    },
    createdAt: { type: Date, default: Date.now },
  // Add other fields as needed
});

// Create the User model
const Job = mongoose.model('Job', JobSchema);

export default Job;
