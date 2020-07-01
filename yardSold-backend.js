const { ApolloServer, gql } = require('apollo-server')

const typeDefs = gql`
  type Vendor {
    name: String!
    phone: String        
    items: [Item]
  }

  type Item {
    name: String!
    price: String!
    id: ID!
  }
  

  type Query {
    vendorCount: Int!
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