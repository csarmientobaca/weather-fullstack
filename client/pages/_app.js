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

// client
//   .query({
//     query: gql`
//     query getWeather($lat: Float!, $lon: Float!) {
//       getWeather(lat: $lat, lon: $lon) {
//         weather {
//           icon
//           id
//         }
//       }
//     }
//   `,
//     variables: {
//       lat: 12,
//       lon: 33,
//     },
//   })
//   .then((result) => console.log(result));


export default function App({ Component, pageProps }) {


  return <ApolloProvider client={client}><Component {...pageProps} /></ApolloProvider >

}
