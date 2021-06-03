import { useQuery } from "@apollo/client"

import { GET_MY_PROFILE } from "../../queries"
import { MyProfileType } from "../../../types/queriesType"

export const useGetMyProfile = () => {
    const { loading: loadingMyProfile, data: dataMyProfile, error: errorMyProfile } = useQuery<MyProfileType>(GET_MY_PROFILE, {
        fetchPolicy: "cache-and-network",
    })

    return { loadingMyProfile, dataMyProfile, errorMyProfile } 
}