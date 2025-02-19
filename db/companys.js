import DataLoader from 'dataloader';
import connection from './connection.js';
import Company from './models/Company.js';
// import { connection } from './connection.js';

// const getCompanyTable = () => connection.table('company');
/* export async function getUser(id) {
  return await User.findOne({ id }).exec(); // `.exec()` ensures a proper Promise is returned
} */

export async function getCompany(id) {
  return await Company.findOne({ id }).exec();
  //getCompanyTable().first().where({ id });
}

export function createCompanyLoader() {
  return new DataLoader(async (ids) => {
    console.log('[comp loader]ids:', typeof ids, ids);
    // Fetch companies matching the given IDs
    const companys = await Company.find({ id: { $in: ids } }).exec();
    console.log('createCompanyLoader:', companys);
    // Map the results to the order of the provided IDs
    // return ids.map((id) => companies.find((company) => company.id.toString() === id.toString()));
    return ids.map((id) => {
      console.log('mapid:', id);
      const company = companys.find((company) => company.id.toString() === id.toString());
      console.log('mapcomp:', company);
      return company ? company.id : null; // Return `null` if no match is found
    });
  });
}

/* export function createCompanyLoader(){
  return new DataLoader( async (ids) => {
    console.log('[comp loader]ids:', ids);
      const companies = await getCompanyTable().select().whereIn('id', ids);
      return ids.map((id) => companies.find((company) => company.id === id ));
  });
} */
