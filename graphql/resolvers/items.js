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

          /**
           * 
           * Need to implement way to name image images before they are uploaded to cloudinary
           *
           *  
           */

          uploadImage:  async (root, args, context) => {

            const image  = `./testUpload/${args.itemName}`

            // Must be logged-in to upload item images

            const currentVendor = context.currentVendor

            

            if (!currentVendor) {
              throw new AuthenticationError("Not authenticated")
            }

     
            const photo = await cloudinary.uploader.upload(image)

         
            const itm = await Item.findOne({ name : args.itemName})
            
            itm.images = itm.images.concat(`${photo.secure_url}`)
            console.log(itm)

         
            try {

              await itm.save()

              return true
            } catch(error) {
              // Find out why this is returning false even when image successfully uploaded.
              console.log('Kern, error: ', error.message)
              return false
            }
          }
    }
    
}