import { useCallback } from "react"
import { useLazyQuery } from "@apollo/react-hooks"

import { GET_ONE_MEMBER_FINISHED_SCHEDULES } from "../../queries"
import { MyTeamFinishedSchedulesType } from "../../../types/queriesType"

export const useGetOneMemberFinishedSchedules = () => {
    const [getOneMemberFinishedSchedulesQuery,
        { loading: loadingOneMemberFinishedSchedules,
        data: dataOneMemberFinishedSchedules,
        error: errorOneMemberFinishedSchedules
     }] = useLazyQuery<MyTeamFinishedSchedulesType>(GET_ONE_MEMBER_FINISHED_SCHEDULES, {
        fetchPolicy: "cache-and-network",
    })

    const getOneMemberFinishedSchedules = useCallback(
       async (profileId: string) => {
            await getOneMemberFinishedSchedulesQuery({
                variables: { profileId }
            })
        }, [])

    return {
        getOneMemberFinishedSchedules,
        loadingOneMemberFinishedSchedules,
        dataOneMemberFinishedSchedules,
        errorOneMemberFinishedSchedules
    }
}