const bcrypt                                                = require('bcrypt');
const jwt                                                   = require('jsonwebtoken');
const { UserInputError }                                    = require('apollo-server-express');
                                                              require('dotenv').config();


const Vendor                                                = require('../../models/vendor');


module.exports = {
    Mutation: {

        register: async (
          
          _,
          { registerInput : { username, email, password, confirmPassword }
        },
          context,
          info
        ) => {
            // TODO: Validate vendor data
            // TODO: Make sute vendor doesn't already exist
            const vendor =  await Vendor.findOne({ username });
            if(vendor){
              throw new UserInputError('Username is taken', {
                errors: {
                  username: 'This username is taken'
                }
              })
            }
            const saltRounds = 12
            password = await bcrypt.hash(password, saltRounds);

            const newVendor = new Vendor({
                email,
                username,
                password,
            });

            const res = await newVendor.save();

            const token = jwt.sign({
                id: res.id,
                email: res.email,
                username: res.username
            }, process.env.JWT_SECRET, { expiresIn: '1h'});

            return {
                ...res._doc,
                id: res._id,
                token
            }
        },

        login: async (root, args) => {
            const vendor = await Vendor.findOne({ username: args.username })
            const passwordCorrect = vendor === null
              ? false
              : await bcrypt.compare(args.password, vendor.password)
      
            if (!(vendor && passwordCorrect)) {
              throw new UserInputError("Wrong credentials!")
            }
      
            const vendorForToken = {
              username: vendor.username,
              id: vendor._id,
            }
            return { value: jwt.sign(vendorForToken, process.env.JWT_SECRET) }
        }

        
    }
}