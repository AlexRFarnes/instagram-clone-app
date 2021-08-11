import ApolloClient from "apollo-client";
import { WebSocketLink } from "apollo-link-ws";
import { InMemoryCache } from "apollo-cache-inmemory";

const headers = {
  "x-hasura-admin-secret": process.env.REACT_APP_SECRET_HASURA,
};

const client = new ApolloClient({
  link: new WebSocketLink({
    uri: process.env.REACT_APP_ENDPOINT,
    options: {
      reconnect: true,
      lazy: true,
      connectionParams: {
        headers,
      },
    },
  }),
  cache: new InMemoryCache(),
});

export default client;
