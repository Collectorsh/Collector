import { gql } from "@apollo/client";

export const getActivitiesQuery = gql`
  query GetActivities($auctionhouse: PublicKey!) {
    activities(auctionHouses: [$auctionhouse]) {
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
