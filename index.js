'use strict'

const express = require('express')
const http = require('http')
const graphqlHTTP = require('express-graphql')
const { buildSchema } = require('graphql');
const app = express()
const middleware = require('graphql-voyager/middleware');


let schema = buildSchema(`
  type Query {
    title: String!,
    notes: [Note]
    cars: [Car]
  }

  type Car {
    id: String!,
    name: String
  }
  
  type Note {
    id: String!,
    note: String,
    author: String
  }
`)

const root = {
  title: () => {
      return 'Thoughts and notes from NordicAPIs';
  },
  notes: () => [
    {id: '1', note: 'Gott kaffe', author: 'Johannes'},
    {id: '2', note: '"kill your servers"', author: 'Johannes'},
    {id: '3', note: 'graphql voyager seems really good. Easy to setup in express', author: 'Johannes'},
    {id: '4', note: 'If your frontend developers want REST, give them REST. If they want graphQL, then give them graphQL', author: 'Johannes'},
  ],
  cars: () => [
    {id: '1', name: 'Volvo'}
  ]
}

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS,COPY')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  next()
})
app.use('/voyager', middleware.express({ endpointUrl: '/graphql' }));

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true
}))

http.createServer(app).listen(process.env.PORT || 3333, () => {
  console.log('app started...')
})



