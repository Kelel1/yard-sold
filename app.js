import { ApolloServer, UserInputError, AuthenticationError } from 'apollo-server-express'
import   mongoose                                            from 'mongoose'
import { v1 as uuid }                                        from 'uuid'
import express                                               from 'express'
import cloudinary                                            from 'cloudinary'
// import bcrypt                                                from 'bcrypt'
import jwt                                                   from 'jsonwebtoken'
import cors                                                  from 'cors'

import typeDefs                                              from './graphql/typedefs.js'
import resolvers                                             from './graphql/resolvers/index.js'
import dotenv from 'dotenv'

dotenv.config()
// Establish connection to Database
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

console.log('connecting to', process.env.MONGODB_URI)

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })


  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
  })

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      const auth = req ? req.headers.authorization : null
      if (auth && auth.toLowerCase().startsWith('bearer ')) {
        const decodedToken = jwt.verify(
          auth.substring(7), process.env.JWT_SECRET
        )
        const currentVendor = await Vendor.findById(decodedToken.id).populate('items')
        return { currentVendor }
      }
    }
  })


  const app = express()
  app.use(cors())
  server.applyMiddleware({ app })
  
  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
    //console.log(`🚀 Server ready at http://localhost:4000`)
  )