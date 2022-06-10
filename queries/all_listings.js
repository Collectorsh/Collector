import { gql } from "@apollo/client";

export const getAllListingsQuery = gql`
  query GetNfts($auctionHouses: PublicKey!) {
    nfts(
      auctionHouses: [$auctionHouses]
      offset: 0
      limit: 10000
      listed: true
    ) {
      name
      address
      image(width: 1400)
      sellerFeeBasisPoints
      mintAddress
      description
      listings {
        address
        price
        createdAt
        canceledAt
        seller
        tradeState
        metadata
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
        tradeState
      }
      owner {
        associatedTokenAccountAddress
        address
      }
    }
  }
`;
