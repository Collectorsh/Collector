import { gql } from "@apollo/client";

export const getNftQuery = gql`
  query GetNft($address: String!) {
    nft(address: $address) {
      listings {
        id
        price
        createdAt
        canceledAt
        seller
        tradeState
        tradeStateBump
        tokenSize
        auctionHouse {
          address
        }
      }
      offers {
        id
        tradeState
        price
        buyer
        createdAt
        auctionHouse {
          address
        }
      }
      creators {
        address
      }
    }
  }
`;
