const itemResolvers   = require('./items');
const vendorResolvers = require('./vendors');

module.exports = {
    Query: {
        ...vendorResolvers.Query
    }, 
    Mutation: {
        ...vendorResolvers.Mutation
    }
}