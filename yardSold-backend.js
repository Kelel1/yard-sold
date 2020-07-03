const { ApolloServer, gql } = require('apollo-server')
const { v1: uuid }          = require('uuid')

let vendors = [

]

let items = [
  
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
    Description: String
    id: ID!
  }
  

  type Query {
    itemCount: Int!    
  }
`
const resolvers = {
  Query: {
    itemCount: () => 4,
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})