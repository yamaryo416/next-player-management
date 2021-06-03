import { useQuery } from "@apollo/react-hooks"

import { NUM_PAGE } from "../../../constants"
import { GET_MORE_MY_TEAM_POSTS } from "../../queries"
import { MyTeamPostsType } from "../../../types/queriesType"


export const useGetMoreMyTeamPosts = () => {
    const {
        loading: loadingMoreMyTeamPosts,
        data: dataMoreMyTeamPosts,
        error: errorMoreMyTeamPosts,
        fetchMore,
    } = useQuery<MyTeamPostsType>(GET_MORE_MY_TEAM_POSTS, {
        variables: { first: NUM_PAGE  },
        fetchPolicy: "cache-and-network",
    })

  return {
      loadingMoreMyTeamPosts,
      dataMoreMyTeamPosts,
      errorMoreMyTeamPosts,
      fetchMore
  }
}