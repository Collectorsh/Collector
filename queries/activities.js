import { gql } from "@apollo/client";

export const getActivitiesQuery = gql`
  query GetActivities($auctionhouses: [PublicKey!]!) {
    activities(auctionHouses: $auctionhouses) {
      id
      metadata
      auctionHouse {
        address
      }
      price
      createdAt
      wallets {
        address
        profile {
          handle
          profileImageUrl
          description
        }
      }
      activityType
      nft {
        name
        address
        mintAddress
      }
    }
  }
`;
