// apolloClient.ts
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

// Replace this with your GraphQL API endpoint
const GRAPHQL_API_URL = 'https://api-staging.louvrehotels.com/api/v1/graphql';

const client = new ApolloClient({
    link: new HttpLink({
        uri: GRAPHQL_API_URL,
    }),
    cache: new InMemoryCache(),
});

export default client;