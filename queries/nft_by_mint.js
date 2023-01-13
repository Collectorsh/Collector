import { gql } from "@apollo/client";

export const nftByMintAddress = gql`
  query nftByMintAddress($address: String!) {
    nftByMintAddress(address: $address) {
      image
    }
  }
`;
