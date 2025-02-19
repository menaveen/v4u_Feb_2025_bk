// import { connection } from './connection.js';
import connection from './connection.js';
import User from './models/User.js';

// const getUserTable = () => connection.table('user');
// import User from './User.js'; // Adjust the path to where your User model is saved

// Function to get a user by ID
export async function getUser(id) {
  return await User.findOne({ id }).exec(); // `.exec()` ensures a proper Promise is returned
}

export async function getUserByEmail(email) {
  return await User.findOne({ email }).exec();
}

/* export async function getUser(id) {
  return await getUserTable().first().where({ id });
} */

/* export async function getUserByEmail(email) {
  return await getUserTable().first().where({ email });
} */
