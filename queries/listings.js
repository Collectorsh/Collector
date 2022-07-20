import { gql } from "@apollo/client";

export const getListingsQuery = gql`
  query GetNfts($auctionHouses: PublicKey!, $owners: [PublicKey!]) {
    nfts(
      auctionHouses: [$auctionHouses]
      owners: $owners
      offset: 0
      limit: 10000
    ) {
      name
      address
      image(width: 1400)
      sellerFeeBasisPoints
      mintAddress
      description
      listings {
        id
        price
        createdAt
        canceledAt
        seller
        tradeState
        metadata
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
        tradeState
      }
      owner {
        associatedTokenAccountAddress
        address
      }
    }
  }
`;
