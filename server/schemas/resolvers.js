const { AuthenticationError } = require('apollo-server-express');
const { User, Book } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        user: async (parent, {username}) => {
            return User.findOne({ username })
            .select('-__v -password')
            .populate('savedBooks')
        },


    },

    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);

            return { token, user };
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const token = signToken(user);
            return { token, user };

        },
        saveBook: async (parent, { bookId }, context) => {
            if (context.user) {         

              const updatedUser = await User.findByIdAndUpdate(
                { _id: context.user._id },
                { $addToSet: { savedBooks : bookId } },
                { new: true }
              ).poplulate('savedBooks');
      
              return updatedUser;
            }
      
            throw new AuthenticationError('You need to be logged in!');
          },
        deleteBook: async (parent, { bookId }, context) => {
            if (context.user) {
                const updatedUser = await User.findByIdAndUpdate(
                {_id: user._id },
                { $pull: { savedBooks: bookId }},
                { new: true }
                ).populate('savedBooks');

                return updatedUser;
              }
              throw new AuthenticationError('You need to be logged in!'); 
        }

    }
};

module.exports = resolvers;