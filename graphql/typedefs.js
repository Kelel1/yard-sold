const { gql } = require('apollo-server-express')

module.exports =  gql`
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
  type Token {
    value: String!
  }

  type Item {
    name: String!
    price: String!
    inventoryCount: Int!
    images: [String!]
    description: String
    onHold: Boolean!
    totalOnHold: Int!
    id: ID!
  }  

  type Query {
    itemCount: Int!    
    allItems2: String!
    allItems: [Item!]!
    allVendors: [Vendor!]!
    findItem(name: String!): Item
    totalUniqueItems: Int!
    me: Vendor
 
  }

  type Mutation {
    addItem(
      name: String!
      price: String!
      inventoryCount: Int!
      images: [String!]
      description: String!
      onHold: Boolean!
      totalOnHold: Int!
    ): Item

    uploadImage(image: String! itemName: String!): Boolean

    createVendor(
      username: String!
      password: String!
      name: String
      phone: String     
      email: String
      address: String
      items: [String!]
      description: String
      profilePic: String
    ): Vendor

    
    login(
      username: String!
      password: String!
    ): Token    
  }
`
