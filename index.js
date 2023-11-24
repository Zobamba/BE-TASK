import express from 'express'
import dbConnection from './database/db-connection.js'
import authMiddleware from './middleware/auth-middleware.js'
import routes from './routes/routes.js'

const app = express();

app.use(express.json());

app.use(authMiddleware);

app.get('/', (req, res) => {
  res.send('Welcome to BE-TASK')
})

routes(app)

dbConnection()

export default app;
