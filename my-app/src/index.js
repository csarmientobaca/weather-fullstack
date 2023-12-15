import React from 'react';
import * as ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './components/App';

import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  gql
} from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://flyby-router-demo.herokuapp.com/',
  cache: new InMemoryCache(),
});


client
  .query({
    query: gql`
      query GetLocations {
        locations {
          id
          name
        }
      }
    `,
  })
  .then((result) => console.log(result));

const root = ReactDOM.createRoot(document.getElementById('root'));


root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
);