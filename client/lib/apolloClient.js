// lib/apolloClient.js
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';

let apolloClient;

const httpLink = createHttpLink({
    uri: 'http://localhost:8080/graphql', // Your GraphQL server endpoint
});

const authLink = setContext((_, { headers }) => {
    // Include any authentication headers here if required
    return {
        headers: {
            ...headers,
            // Example:
            // authorization: localStorage.getItem('token') || '',
        },
    };
});

function createApolloClient() {
    return new ApolloClient({
        link: authLink.concat(httpLink),
        cache: new InMemoryCache(),
    });
}

export function initializeApollo(initialState = null) {
    const _apolloClient = apolloClient ?? createApolloClient();

    // If your page has Next.js data fetching methods that require Apollo Client,
    // this ensures that Apollo Client is available in those methods
    if (initialState) {
        _apolloClient.cache.restore(initialState);
    }

    // For SSG and SSR always create a new Apollo Client
    if (typeof window === 'undefined') return _apolloClient;

    // Create the Apollo Client once in the client
    if (!apolloClient) apolloClient = _apolloClient;
    return _apolloClient;
}
