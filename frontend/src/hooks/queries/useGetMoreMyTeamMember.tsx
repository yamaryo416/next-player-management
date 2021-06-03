import { useQuery } from "@apollo/client"

import { NUM_PAGE } from "../../../constants"
import { GET_MY_TEAM_MEMBER } from "../../queries"
import { MyTeamMemberType } from "../../../types/queriesType"


export const useGetMoreMyTeamMember = () => {
    const {
        loading: loadingMoreMyTeamMember,
        data: dataMoreMyTeamMember,
        error: errorMoreMyTeamMember,
        fetchMore,
    } = useQuery<MyTeamMemberType>(GET_MY_TEAM_MEMBER, {
        variables: { first: NUM_PAGE },
        fetchPolicy: "cache-and-network",
    })

    return {
        loadingMoreMyTeamMember,
        dataMoreMyTeamMember,
        errorMoreMyTeamMember,
        fetchMore
    }
}