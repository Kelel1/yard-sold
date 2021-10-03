import itemResolvers   from './items.js'
import vendorResolvers from './vendors.js'

export default {
    Query: {
        ...vendorResolvers.Query
    }, 
    Mutation: {
        ...vendorResolvers.Mutation
    }
}