'use strict'

const express = require('express')
const http = require('http')
const graphqlHTTP = require('express-graphql')
const { buildSchema } = require('graphql');
const app = express()
const middleware = require('graphql-voyager/middleware');


let schema = buildSchema(`
  type Query {
    post: Post,
    comments: [Comment]
  }
  
  type Post {
    id: String!,
    title: String,
    body: String
  }
  
  type Comment {
    id: String!,
    comment: String,
    author: String
  }
`)

const root = {
  post: () => {
    return {
      id: '1',
      title: 'Thoughts from NordicAPIs',
      body: 'Hello from strockholm'
    }
  },
  comments: () => [
    {id: '1', comment: 'Gott kaffe', author: 'Johannes'},
  ]
}

app.use('/voyager', middleware.express({ endpointUrl: '/graphql' }));

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true
}))

http.createServer(app).listen(3333, () => {
  console.log('app started...')
})



