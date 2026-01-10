import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { cookies } from "next/headers";

export async function serverClient() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
  return new ApolloClient({
    ssrMode: true,
    link: new HttpLink({
      uri: `${process.env.NEXT_PUBLIC_API_URL}/graphql`,
      fetch,
      credentials: "include",
      headers: {
        cookie: cookieHeader,
      },
    }),
    cache: new InMemoryCache(),
  });
}