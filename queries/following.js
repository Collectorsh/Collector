import { gql } from "@apollo/client";

export const getFollowingQuery = gql`
  query GetConnections($from: PublicKey!) {
    connections(from: [$from], offset: 0, limit: 10000) {
      to {
        address
      }
    }
  }
`;
