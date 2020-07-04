const { ApolloServer, gql } = require('apollo-server')
const { v1: uuid }          = require('uuid')

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

let items = [
  {
    name: "Shadow Tactics",
    price: 3.99,
    inventoryCount: 5,
    description: "Top-Down stealth Playstation 4 game, set in medival Japan",
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
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})