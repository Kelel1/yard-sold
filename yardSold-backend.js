const { ApolloServer, gql } = require('apollo-server-express')
const { v1: uuid }          = require('uuid')
const express               = require('express')
const cloudinary            = require('cloudinary')
require('dotenv').config()


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
})

let vendors = [
  {
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

/**
 *  May have to add customer array for Vendor
 */
const typeDefs = gql`
  type Vendor {
    name: String!
    phone: String        
    email: String!
    address: String
    items: [Item!]
    id: ID!
  }

  type Item {
    name: String!
    price: Float!
    inventoryCount: Int!
    images: [String!]
    description: String
    id: ID!
  }  

  type Query {
    itemCount: Int!    
    allItems: [Item!]!
    allVendors: [Vendor!]!
    findItem(name: String!): Item
    totalUniqueItems: Int!
  }

  type Mutation {
    addItem(
      name: String!
      price: Float!
      inventoryCount: Int!
      images: [String!]
      description: String!
    ): Item
    uploadImage(image: String!, itemName: String!): Boolean
  }
`
const resolvers = {
  Query: {
    itemCount: () => 4,
    allItems: () => items,
    allVendors: () => vendors,
    totalUniqueItems: () => items.length     
    
  },

  Mutation: {
    addItem: (root, args) => {
      const item = { ...args, id: uuid() }
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
          return false

      }
    }    
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

const app = express()
server.applyMiddleware({ app })

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
)