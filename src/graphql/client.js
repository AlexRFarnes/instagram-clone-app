import ApolloClient from "apollo-client";
import { WebSocketLink } from "apollo-link-ws";
import { InMemoryCache } from "apollo-cache-inmemory";

const headers = {
  "x-hasura-admin-secret": "xxxx-xxxx-xxxx-xxxx",
};

const client = new ApolloClient({
  link: new WebSocketLink({
    uri: "wss://instagram-clone-app-react.herokuapp.com/v1/graphql",
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
