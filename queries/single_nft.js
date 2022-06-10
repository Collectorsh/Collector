import { gql } from "@apollo/client";

export const getNftQuery = gql`
  query GetNft($address: String!) {
    nft(address: $address) {
      listings {
        address
        price
        createdAt
        canceledAt
        seller
        tradeState
        tradeStateBump
        purchaseReceipt
        tokenSize
        bump
        auctionHouse
      }
      offers {
        address
        tradeState
        price
        buyer
        createdAt
      }
      creators {
        address
      }
    }
  }
`;
