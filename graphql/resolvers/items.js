import { v1 as uuid }                                        from 'uuid'
import { UserInputError, AuthenticationError }               from 'apollo-server-express'

// Cloudninary still uses/needs require
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const  cloudinary = require('cloudinary').v2;

import Item from '../../models/item.js'

export default {

    Mutation: {
        addItem:  async (root, args, context) => {
            const item = new Item({ ...args, id: uuid() })
            const currentVendor = context.currentVendor
      
            // Must be logged in to add items
            if (!currentVendor) {
              throw new AuthenticationError("Not authenticated")
            }
            try {
              await item.save()
              // Try implementing this catch for upLoad image to see if it resolves issue
              currentVendor.items = currentVendor.items.concat(item)
              await currentVendor.save()
            } catch (error) {
              // throw new UserInputError(error.message, {
              //   invalidArgs: args,
              // })
            }
      
            return item
          },

          // New uploadImage
          /**
           *  Need to log in in order to add/edit  item photos
           * 
           *  
           *
           */
          // uploadImage:  async (root, args, context) => {

            // const currentVendor = context.currentVendor
      
            // Must be logged in to add items
            // if (!currentVendor) {
            //   throw new AuthenticationError("Not authenticated")
            // }

            // currentVendor.items.find(a => a.name === args.itemName)
            // vendorGoods = currentVendor.items
            


          //   args = `./testUpload/${args.itemName}`
          //   // console.log(`${args}`)
          //   console.log(args.itemName)
      
          //   try {
          //     const photo = await cloudinary.uploader.upload(args)
              
          //     console.log('Store in item images array: ',photo.secure_url)
             
              
          //     return true
          //   } catch(error) {
          //     // Find out why this is returning false even when image successfully uploaded.
          //     console.log('Kern, error: ', error.message)
          //     return false
          //   }
          // },


          uploadImage:  async (root, args) => {
            

            // need to deconstruct args in order to read values
            const test = { ...args, b: args.itemName}
            args = `./testUpload/${args.itemName}`
            
            
            console.log(test.b, " test")
    
       
      
            try {
              const photo = await cloudinary.uploader.upload(args)
              
              // console.log('Store in item images array: ',photo.secure_url)
             
              let shadowz  = Item.find(a => a.name === args.itemName)
              console.log(shadowz.itemName)

              // shadow.images.push(photo.secure_url)
              return true
            } catch(error) {
              // Find out why this is returning false even when image successfully uploaded.
              console.log('Kern, error: ', error.message)
              return false
            }
          }
    }
    
}