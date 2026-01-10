import { gql } from "@apollo/client";

// Get Experiences Query
export const GET_EXPERIENCES = gql`
  query Experiences($category: String, $cursor: String, $limit: Int) {
    experiences(category: $category, cursor: $cursor, limit: $limit) {
      data {
        id
        title
        featured
        isNew
        rating
        hours
        price
        images {
          id
          original
          large
          medium
          small
          thumbnail
        }
      }
      hasMore
      nextCursor
    }
  }
`;