import fetch from 'cross-fetch'
import { AppProps } from 'next/app'
import { ApolloProvider } from '@apollo/react-hooks'
import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { ChakraProvider } from '@chakra-ui/react';
import { RecoilRoot } from 'recoil';

import theme from '../theme/theme';

const httpLink = createHttpLink({
  uri: "http://0.0.0.0:8000/graphql/",
  fetch
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token")
  return {
    headers: {
      ...headers,
      authorization: token ? `JWT ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})
function MyApp({ Component, pageProps }: AppProps) {
    return (
        <ApolloProvider client={client}>
             <RecoilRoot>
                <ChakraProvider theme={theme}>
                    <Component {...pageProps} />
                </ChakraProvider>
             </RecoilRoot>
        </ApolloProvider>
    )
}

export default MyApp