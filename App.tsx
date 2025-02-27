// App.tsx
import React from 'react';
import {ApolloProvider} from '@apollo/client';
import client from './src/graphql/ApolloClient';
import DropInView from './src/dropInView/DropInView';
const App = () => {
  return (
    <ApolloProvider client={client}>
      <DropInView />
    </ApolloProvider>
  );
};

export default App;
