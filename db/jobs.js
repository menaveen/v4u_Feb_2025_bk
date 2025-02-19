// import { connection } from './connection.js';
// import connection from './connection.js';
import { generateId } from './ids.js';
import Job from './models/Job.js';

// const getJobTable = () => connection.table('job');

export async function countJobs(){
  const count = await Job.countDocuments();
  return count;
}


export async function getJobs(limit, offset) {
  const pipeline = [
    {
      $lookup: {
        from: "companys", // The target collection for the join
        localField: "companyId", // Field in `jobs` collection
        foreignField: "id", // Field in `companys` collection
        as: "company", // Output field
      },
    }/* ,
    {
        $unwind: '$company', // Unwind the company array to a single object (optional if only one company per job)
    } */,
    { $sort: { createdAt: -1 } }, // Sort by `createdAt` in descending order
  ];

  if (offset) {
    pipeline.push({ $skip: offset }); // Skip the specified number of records
  }

  if (limit) {
    pipeline.push({ $limit: limit }); // Limit the number of records
  }

  // Execute the aggregation pipeline
  const jobs = await Job.aggregate(pipeline);
  // const company = jobs; // Safely access the first company object
  // console.log('jobcomp:', jobs);
   
  // console.log('aggjob>>', jobs,typeof jobs);
  return jobs;
}


/* export async function getJobs(limit, offset) {
  // const query = getJobTable().select().orderBy('createdAt','desc');
  const query = Job.find().sort({ createdAt: -1});
  // console.log('getjobsQuery:', query);
  if(limit){
    query.limit(limit);
  }
  if(offset){
    query.skip(offset);
  }
  // console.log('getjobsQuery2:', query);
  return await query.exec();
} */

export async function getJob(id) {
  return await Job.findOne({ id }).exec();
  //getJobTable().first().where({ id });
}

export async function getJobsByCompany(companyId){
  return await Job.find({companyId}).exec();
  //getJobTable().select().where({companyId});
}

export async function createJob({ companyId, title, description }) {
  const job = {
    id: generateId(),
    companyId,
    title,
    description,
    createdAt: new Date().toISOString(),
  };
  await Job.insert(job).exec();
  //getJobTable().insert(job);
  return job;
}

export async function deleteJob(id, companyId) {
  const job = await getJobTable().first().where({ id, companyId });
  if (!job) { return null;
    // throw new Error(`Job not found: ${id}`);
  }
  await Job.deleteOne({ id }).exec();
  //getJobTable().delete().where({ id });
  return job;
}

export async function updateJob({ id, companyId, title, description }) {
  // console.log('updatejob:', companyId);
  const job = await getJobTable().first().where({ id, companyId });
  // console.log('jobresult:', job);
  if (!job) { 
    // console.log('jobresult2:');
    return null;
    // throw new Error(`Job not found: ${id}`);
  }
  const updatedFields = { title, description };
  await Job.findOneAndUpdate({id}, updatedFields).exec();
  //getJobTable().update(updatedFields).where({ id });
  return { ...job, ...updatedFields };
}

/* export async function getJobs(limit, offset) {
  const query = getJobTable().select().orderBy('createdAt','desc');
  if(limit){
    query.limit(limit);
  }
  if(offset){
    query.offset(offset);
  }
  return await query;
} */
