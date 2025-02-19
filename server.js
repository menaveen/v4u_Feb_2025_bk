import { ApolloServer } from '@apollo/server';
import { expressMiddleware as apolloMiddleware } from "@apollo/server/express4";
import cors from 'cors';
import express from 'express';
import { readFile } from 'node:fs/promises';
import { authMiddleware, handleLogin } from './auth.js';
import { resolvers } from "./resolvers.js";
import { getUser } from './db/users.js';
import { createCompanyLoader } from './db/companys.js';

const PORT = 9001;

const app = express();
app.use(cors(), express.json(), authMiddleware);

app.post('/login', handleLogin);

const typeDefs = await readFile('./schema.graphql','utf8');

const apolloServer = new ApolloServer({ typeDefs, resolvers});
await apolloServer.start();
async function getContext({req})
{
  const companyLoader = createCompanyLoader();
  const context = { companyLoader };
  // console.log('auth<<<', req.auth);
  if(req.auth){
      context.user = await getUser(req.auth.sub);
      // console.log('context<<<', context);
  }
  return context;
  /* return { auth : req.auth}; */
}
app.use('/graphql', apolloMiddleware(apolloServer, { context : getContext } ));

app.listen({ port: PORT }, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`GraphQL running on port http://localhost:${PORT}/graphql`);
});
