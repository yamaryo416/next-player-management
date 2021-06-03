import { useCallback } from "react"
import { useMutation } from "@apollo/client"
import { useRecoilValue } from "recoil"

import { DELETE_FINISHED_SCHEDULE_MEMBER, GET_MY_TEAM_FINISHED_SCHEDULES, GET_MY_TEAM_TRAININGS, GET_ONE_DAY_SCHEDULES } from "../../queries"
import { scheduleOneDayState } from "../../store/scheduleOneDayState"

export const useDeleteFinishedSchedule = () => {
    const oneDay = useRecoilValue(scheduleOneDayState)

    const [deleteCoachUserFinishedScheduleMutation] = useMutation(DELETE_FINISHED_SCHEDULE_MEMBER, {
        refetchQueries: [
            { query: GET_MY_TEAM_FINISHED_SCHEDULES},
            { query: GET_MY_TEAM_TRAININGS},
            { query: GET_ONE_DAY_SCHEDULES, variables: { date: oneDay} }
        ]})
    const [deleteGeneralUserFinishedScheduleMutation] = useMutation(DELETE_FINISHED_SCHEDULE_MEMBER, {
        refetchQueries: [
            { query: GET_MY_TEAM_TRAININGS},
            { query: GET_ONE_DAY_SCHEDULES, variables: { date: oneDay} }
        ]})

    const deleteFinishedSchedule = useCallback(
        async (scheduleId: string, isCoach: boolean) =>
            isCoach ? (
                await deleteCoachUserFinishedScheduleMutation({ variables: { scheduleId } })
            ) : (
                await deleteGeneralUserFinishedScheduleMutation({ variables: { scheduleId } })
            )
        , [])
    
    return { deleteFinishedSchedule }
}