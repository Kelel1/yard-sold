const { ApolloServer, gql, UserInputError, AuthenticationError } = require('apollo-server-express')
const mongoose              = require('mongoose')
const { v1: uuid }          = require('uuid')
const express               = require('express')
const cloudinary            = require('cloudinary')
const Item                  = require('./models/item')
const Vendor                = require('./models/vendor')
const bcrypt                = require('bcrypt')
const jwt                   = require('jsonwebtoken')
require('dotenv').config()


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
/**
 * To Do:
 * 1. Tie the ability to create/upload items to each vendor
 * 2. Implement ability to edit details of vendor/item
 * 3. Implement vendor athorization and tie to items uploaded to specific vendor
 * 4. Implement error handeling
 * 
 */

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
})

let vendors = [
  {
    username: "Kelel",
    password: "kelder",
    name: "Kane Elder",
    phone: "948-555-4974",
    email: "kelxty@gmail.com",
    address: "10125 Rigs Rd, Adelki, Maryland, 57803",
    items: [],
    id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
  }

]

/**
 * Item must upload image to cloudinary bucket
 */

let items = [
  {
    name: "Shadow Tactics",
    price: 3.99,
    inventoryCount: 5,
    description: "Top-Down stealth Playstation 4 game, set in medival Japan",
    images: [],
    id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
  }

]


const typeDefs = gql`
  type Vendor {   
    username: String!
    name: String!
    phone: String!        
    email: String!
    address: String
    items: [Item!]
    description: String!,
    profilePic: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Item {
    name: String!
    price: Float!
    inventoryCount: Int!
    images: [String!]
    description: String
    onHold: Boolean!
    totalOnHold: Int!
    id: ID!
  }  

  type Query {
    itemCount: Int!    
    allItems: [Item!]!
    allVendors: [Vendor!]!
    findItem(name: String!): Item
    totalUniqueItems: Int!
    me: Vendor
 
  }

  type Mutation {
    addItem(
      name: String!
      price: Float!
      inventoryCount: Int!
      images: [String!]
      description: String!
      onHold: Boolean!
      totalOnHold: Int!
    ): Item

    uploadImage(image: String!, itemName: String!): Boolean

    createVendor(
      username: String!
      password: String!
    ): Vendor
    login(
      username: String!
      password: String!
    ): Token    
  }
`
const resolvers = {
  Query: {
    itemCount: () => 4,
    allItems: () => items,
    allVendors: () => vendors,
    totalUniqueItems: () => items.length,
    me: (root, args, context) => {
      return context.currentVendor
    }    
  },

  Mutation: {
    addItem:  async (root, args, context) => {
      const item = new Item({ ...args, id: uuid() })
      const currentVendor = context.currentVendor

      if (!currentVendor) {
        throw new AuthenticationError("Not authenticated")
      }
      try {
        await item.save()
        // Try implementing this catch for upLoad image to see if it resolves issue
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
      items = items.concat(item)
      return item
    },
    uploadImage:  async (root, args) => {
      args = `./testUpload/${args.image}`
      console.log(`${args}`)

      try {
        const photo = await cloudinary.v2.uploader.upload(args)
        // console.log(photo)
        console.log('Store in item images array: ',photo.secure_url)
        let shadow  = items.find(a => a.name === `${args.itemName}`)
        shadow.images.push(photo.secure_url)
        return true
      } catch(error) {
        // Find out why this is returning false even when image successfully uploaded.
        console.log('Kern, error: ', error.message)
        return false
      }
    },
    createVendor: async (root, args) => {
      const saltRounds = 10
      const paswordHash = await bcrypt.hash(args.password, saltRounds)
      const vendor = new Vendor({ username: args.username, paswordHash })

      return vendor.save()
        .catch(error => {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          })
        })
    },
    login: async (root, args) => {
      const vendor = await Vendor.findOne({ username: args.username })
      const passwordCorrect = vendor === null
        ? false
        : await bcrypt.compare(args.password, vendor.paswordHash)

      if (!(vendor && passwordCorrect)) {
        throw new UserInputError("Wrong credentials!")
      }

      const vendorForToken = {
        username: vendor.username,
        id: vendor._id,
      }

      return { value: jwt.sign(vendorForToken, process.env.JWT_SECRET) }
    }    
  }
}

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
server.applyMiddleware({ app })

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
)