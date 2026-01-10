"use client";

import * as React from "react";
import { ApolloProvider } from "@apollo/client/react";
import client from "./apollo-client";

interface ApolloWrapperProps {
  children: any;
}

export default function ApolloWrapper({ children }: ApolloWrapperProps) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
