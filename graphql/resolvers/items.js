import { v1 as uuid }                                        from 'uuid'
import { UserInputError, AuthenticationError }               from 'apollo-server-express'


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
          uploadImage:  async (root, args) => {
            args = `./testUpload/${args.image}`
            console.log(`${args}`)
      
            try {
              const photo = await cloudinary.v2.uploader.upload(args)
              // console.log(photo)
              console.log('Store in item images array: ',photo.secure_url)
              // rename variable shadow
              let shadow  = items.find(a => a.name === `${args.itemName}`)
              shadow.images.push(photo.secure_url)
              return true
            } catch(error) {
              // Find out why this is returning false even when image successfully uploaded.
              console.log('Kern, error: ', error.message)
              return false
            }
          }
    }
    
}