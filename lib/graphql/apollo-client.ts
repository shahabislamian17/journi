import { ApolloClient, InMemoryCache, split } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import UploadHttpLink from "apollo-upload-client/UploadHttpLink.mjs";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";

// 1. HTTP link (queries + mutations, with upload support)
const httpLink = new UploadHttpLink({
  uri: `${process.env.NEXT_PUBLIC_API_URL}/graphql`,
  fetch,
  credentials: "include",
});

// 2. WebSocket link (subscriptions)
// Convert HTTP URL to WebSocket URL
const getWsUrl = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
  if (apiUrl.startsWith('https://')) {
    return apiUrl.replace('https://', 'wss://') + '/graphql';
  } else if (apiUrl.startsWith('http://')) {
    return apiUrl.replace('http://', 'ws://') + '/graphql';
  }
  return 'ws://localhost:4000/graphql'; // fallback
};

const wsLink =
  typeof window !== "undefined"
    ? new GraphQLWsLink(
        createClient({
          url: getWsUrl()
        })
      )
    : null;

// 3. Split links: queries/mutations → httpLink, subscriptions → wsLink
const splitLink =
  typeof window !== "undefined" && wsLink != null
    ? split(
        ({ query }) => {
          const def = getMainDefinition(query);
          return (
            def.kind === "OperationDefinition" &&
            def.operation === "subscription"
          );
        },
        wsLink,
        httpLink
      )
    : httpLink;

// 4. Apollo client
const client = new ApolloClient({
  ssrMode: typeof window === "undefined",
  link: splitLink,
  cache: new InMemoryCache(),
});

export default client;