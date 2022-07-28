import {
    ApolloClient,
    InMemoryCache,
    NormalizedCacheObject,
} from '@apollo/client'

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
    cache: new InMemoryCache(),
    uri: 'http://localhost:4000/graphql',
})

export default client
