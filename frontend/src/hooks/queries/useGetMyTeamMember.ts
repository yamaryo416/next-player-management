import { useQuery } from "@apollo/client"

import { GET_MY_TEAM_MEMBER } from "../../queries"
import { MyTeamMemberType } from "../../../types/queriesType"

export const useGetMyTeamMember = () => {
    const { loading: loadingMyTeamMember, data: dataMyTeamMember, error: errorMyTeamMember } = useQuery<MyTeamMemberType>(GET_MY_TEAM_MEMBER, {
        fetchPolicy: "cache-and-network",
    })

    return { loadingMyTeamMember, dataMyTeamMember, errorMyTeamMember }
}