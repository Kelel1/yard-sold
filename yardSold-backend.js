const { ApolloServer, gql } = require('apollo-server')

const typeDefs = gql`
  type Vendor {
    name: String!
    phone: String        
    email: String!
    Address: String
    items: [Item!]
    customers: ???
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

  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})