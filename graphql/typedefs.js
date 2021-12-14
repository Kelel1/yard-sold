import { gql } from 'apollo-server-express'

export default gql`
  type Vendor {   
    username: String!
    password: String!
    name: String!
    phone: String!        
    email: String!
    address: String
    createdAt: String
    items: [Item!]
    description: String!
    profilePic: String!
    token: String!
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

  input RegisterInput{
    username: String!
    password: String!
    confirmPassword: String!
    email: String!

  }

  type Query {
    itemCount: Int!    
    allItems: Int!
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

    # deleteItem()

    # updateItem()

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

    register(registerInput: RegisterInput): Vendor!

    
    login(
      username: String!
      password: String!
    ): Token    
  }
`
