import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { UserInputError } from 'apollo-server-express'
import { validateRegisterInput } from '../../util/validator.js'
import Vendor from '../../models/vendor.js'
import dotenv from 'dotenv'
dotenv.config()

export default {

    Query: {
//    allVendors test query
      allVendors: async () => {
        try {
          const vend = (await Vendor.find()).length
          return vend
        } catch(err) {

          throw new Error(err)

        }
      },

      me: async (root, args, context) => {
        return context.currentVendor
      }

    }, 
    Mutation: {

        register: async (
          
          _,
          { registerInput : { username, email, password, confirmPassword }
        },
        ) => {
            const { valid, errors } = validateRegisterInput(email, password, confirmPassword);
            if(!valid){
              throw new UserInputError('Errors', { errors });
            }
        

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
                createdAt: new Date().toISOString()
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