// import knex from 'knex';
import mongoose from 'mongoose';

/* export const connection = knex({
  client: 'better-sqlite3',
  connection: {
    filename: './data/db.sqlite3',
  },
  useNullAsDefault: true,
});

connection.on('query',({ sql, bindings }) => {
  const query = connection.raw(sql, bindings).toQuery();
  console.log('[db]', query);
}) */

// import mongoose from 'mongoose';

// MongoDB connection string
const MONGO_URI = 'mongodb://localhost:27017/graphql';

// Establishing a Mongoose connection
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Mongoose connection object
const connection = mongoose.connection;

// Event listeners for the connection
connection.on('connected', () => {
  console.log('[db] Connected to MongoDB');
});

connection.on('error', (error) => {
  console.error('[db] Connection error:', error);
});

connection.on('disconnected', () => {
  console.log('[db] Disconnected from MongoDB');
});

// Export the connection
export default connection;

// For logging queries (Mongoose doesn’t log them by default)
mongoose.set('debug', (collectionName, method, query, doc) => {
  console.log(
    `[db] ${collectionName}.${method}`,
    JSON.stringify(query),
    doc ? JSON.stringify(doc) : ''
  );
});



/* const startApp = async () => {
  try{
      await mongoose.connect(DB, {
          useNewUrlParser: true,
          useFindAndModify: false,
          useUnifiedTopology: true
      });
      success({
          badge: true,
          message: `🚀 Successfully connected with the database`,
      });
  
      await server.start();
       server.applyMiddleware({
          app,
          cors: true
      });
      app.listen(PORT, () =>
          success({
              badge: true,
              message: `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`,
          })
       );  
  }  catch(err){
      error({
          message: err.message
      })
  }
}

startApp(); */
