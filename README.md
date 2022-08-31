Backend GraphQl server for Yard Sold web-app

Bring your Yard Sale into the 21st Century!!!

GraphQl playground: http://localhost:4000/graphql

Playground Permisions should be added under HTTP HEADERS section:

{
  "Authorization": "bearer ..."
}

Test Mutattions:

1.

mutation{
  login(username:"Kelder", password:"abcd") {
    value
  }
}


2.

mutation {
  addItem(name:"newShadow.jpg", price: "40182", onHold: false, totalOnHold: 0, inventoryCount: 4, description: "control") {
    name
  }
}


3.


mutation {
  uploadImage(itemName:"newShadow.jpg") 

}

### Roadmap

# Short Term
- -[x] Modularize Backend



- Extend Functionality  

  1. Add Mutations for:
    
        - Logout

        - Edit item/vendor

        - Delete image

        - Delete Item

        - Delete User Account

        - Change password
     
  2. - [x] Finish second Implementation of add image for uploadImage resolver
       
  3. - [x] Investigate/fix current issue with token not user token not expiring after set time
        
# Long term
- - [] Switch codebase over to typescript
- - [] Implement CI/CD
- - [] Implment containerization
