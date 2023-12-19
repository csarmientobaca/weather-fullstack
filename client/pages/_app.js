import '@/styles/globals.css'
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql
} from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://127.0.0.1:8080/graphql',
  cache: new InMemoryCache(),
});


export default function App({ Component, pageProps }) {


  return <ApolloProvider client={client}><Component {...pageProps} /></ApolloProvider >

}
