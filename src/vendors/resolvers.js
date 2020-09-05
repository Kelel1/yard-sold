const { Vendor } = require('./Vendor');
const Item       = require('../models/item');

const resolvers = {
  Query: {
    name: () => Vendor.name,
  },
  Mutation: {
    addItem:  async (root, args, context) => {
      const item = new Item({ ...args, id: uuid() })
      const currentVendor = context.currentVendor

      if (!currentVendor) {
        throw new AuthenticationError("Not authenticated")
      }
      try {
        await item.save()
        // Try implementing this catch for upLoad image to see if it resolves issue
        currentVendor.items = currentVendor.items.concat(item)
        await currentVendor.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
      // items = items.concat(item)
      return item
    }
  },

};

module.exports = {
  resolvers,
}