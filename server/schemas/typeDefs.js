const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]
  }

  type Book {
    _id: ID
    description: String
    bookID: String
    image: String
    link: String
    title: String
    authors: [{String}]
  }

  input BookInput {
    description: String
    bookID: String
    image: String
    link: String
    title: String
    authors: [{String}]
  }

  type Auth {
    token: ID!
    user: User
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(input: BookInput): User
    removeBook(bookId: String): User
  }


`;

module.exports = typeDefs;