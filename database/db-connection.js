import { MongoClient, ServerApiVersion } from 'mongodb'
const uri = 'mongodb+srv://onahbernardchizoba:xO8P0kAi0paVpVM4@cluster0.panhrzo.mongodb.net/?retryWrites=true&w=majority'

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

export default async function dbConnection () {
  try {
    await client.connect()
    await client.db('admin').command({ ping: 1 })
    console.log('Pinged your deployment. You successfully connected to MongoDB!')
  } finally {
    await client.close()
  }
}
