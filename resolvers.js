import { createJob, getJob,getJobs, getJobsByCompany, deleteJob, updateJob, countJobs } from "./db/jobs.js";
import {  getCompany } from "./db/companys.js";
import { GraphQLError } from "graphql";

export const resolvers = {
    Query : {
        companyById: async (__root,{id}) => {
            const company = await getCompany(id);
            if(!company){
                throw notFoundError('No Company with id - '+id);
            }
            return company;
        },
        job: async (__root,{id}) => {
            const job = await getJob(id);
            if(!job){
                throw notFoundError('No Job with id - '+id);
            }
            return job;
        },
        jobs: async (__root, { limit, offset }) =>  {
            const jobs = await getJobs(limit, offset);
            // console.log('rootjobs:', jobs);
            // return;
            const items = jobs.map((job) => {
                const company = job.company?.[0]; // Safely access the first company object
                // console.log('arrcomp>>', company);
                return {
                  id: job.id,
                  title: job.title,
                  description: job.description,
                  companyId: job.companyId,
                  createdAt: job.createdAt,
                  company: company
                    ? {
                        id: company?.id,
                        name: company?.name,
                      }
                    : null, // Handle cases where the company array might be empty
                };
              });
            //   console.log('formattedJobs:',typeof formattedJobs[0].company,formattedJobs[0].company.id,formattedJobs);
            const totalCount = await countJobs();
              
            return { items, totalCount };
        }
    },
    Mutation : {
        createJob : (__root, {input:{ title, description }}, { user }) => {
            /* console.log('contexte>>', user);
            return null; */
            // console.log('title:', title, 'desc:', description);
            if(!user){
                throw unAuthorizedError('Missing Authentication');
            }
            // const companyId = 'Gu7QW9LcnF5d';
            return createJob({ companyId: user.companyId, title, description });
        },
        updateJob : async (__root, {input: {id, title, description}}, { user }) => {
            if(!user){
                throw unAuthorizedError('Missing Authentication');
            }
            const job = await updateJob({ id, companyId: user.companyId,title, description });
            // console.log('jobresult3:', job);
            if(!job){
                throw unAuthorizedError('No job found with id - '+ id);
            }
            return job;
        },
        deleteJob : async (__root, {id}, { user }) => {
            if(!user){
                throw unAuthorizedError('Missing Authentication');
            }
            const job = await deleteJob(id, user.companyId);
            if(!job){
                throw unAuthorizedError('No job found with id - '+ id);
            }
            return job;
        },
    },
    Company : {
        jobs : async (company) => {
            console.log('compResolver:',company.id);
            return await getJobsByCompany(company.id)
        },
    },
    Job : {
        company : async (job, _args, { companyLoader  }) => {
            return getCompany(job?.companyId);
           
                // console.log('companyLoader>>',companyLoader);
                // const companyLoaderResult= await companyLoader.load(job?.companyId)
                // console.log('jobargs>>', companyLoaderResult, job?.companyId);
                // if (!companyLoaderResult) {
                //     throw new Error(`Company with ID ${job.companyId} not found`);
                //   }
                // return companyLoaderResult ? [companyLoaderResult] : [];
        },
        date: (job) => toIsoDate(job.createdAt),
    }
};

function notFoundError(msg){
    return new GraphQLError(msg,
        { extensions: { code: 'NOT_FOUND'}}
    );
}

function unAuthorizedError(msg){
    return new GraphQLError(msg,
        { extensions: { code: 'NOT_AUTHORIZED'}}
    );
}

function toIsoDate(value){
    /* console.log('valuetype:',typeof value, value.toISOString().slice(0, 'yyyy-mm-dd'.length));
    return; */
    if (!(value instanceof Date)) {
        throw new Error('Invalid date value');
      }
    return value.toISOString().slice(0, 'yyyy-mm-dd'.length)
}

