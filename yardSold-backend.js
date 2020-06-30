const { gql } = require("apollo-server")

const { ApolloServer, gql } = require('apollo-server')

const typedefs = gql`
  type Vendor (
    name: String!
    phone: String
  )
`