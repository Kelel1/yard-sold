const { gql } = require('apollo-server-express');

const typeDef = gql`

  type Vendor {   
    username: String!
    password: String!
    name: String!
    phone: String!        
    email: String!
    address: String
    items: [Item!]
    description: String!
    profilePic: String!
    id: ID!
  }
`;

module.exports = {
  typeDef
};