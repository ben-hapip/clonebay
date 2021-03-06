import graphqlHTTP from 'express-graphql'
import { buildSchema } from 'graphql'
import userService from '../services/userServices'

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  type Query {
    user(id: String!): User
  }
  type Mutation {
    createUser(input: UserInput!): User,
    deleteUser(id: String!): DeleteUserResponse,
    login( input: UserInput! ): LoginResponse      
  }
  input UserInput {
    email: String!,
    password: String!
  }
  type DeleteUserResponse {
    user: User!
  }
  type LoginResponse {
    status: Boolean!
  }
  type User {
    id: ID!,
    email: String!,
    password: String!
  }
`)

const rootResolver = {
  user: graphqlInput => userService.getUser(graphqlInput.id),
  createUser: graphqlInput => userService.createUser(graphqlInput.input),
  deleteUser: graphqlInput => userService.deleteUser(graphqlInput.id),
  login: graphqlInput => userService.login(graphqlInput.input),
}

const graphql = graphqlHTTP({
  schema,
  rootValue: rootResolver,
  graphiql: true, // this creates the interactive GraphQL API explorer with documentation.
})

module.exports = graphql
