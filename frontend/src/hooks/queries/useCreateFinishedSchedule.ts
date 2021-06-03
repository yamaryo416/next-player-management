import { useCallback } from "react"
import { useMutation } from "@apollo/client"
import { useRecoilValue } from "recoil"

import { CREATE_FINISHED_SCHEDULE_MEMBER, GET_MY_TEAM_FINISHED_SCHEDULES, GET_MY_TEAM_TRAININGS, GET_ONE_DAY_SCHEDULES } from "../../queries"
import { scheduleOneDayState } from "../../store/scheduleOneDayState"

export const useCreateFinishedSchedule = () => {
    const oneDay = useRecoilValue(scheduleOneDayState)
    
    const [createCoachUserFinishedScheduleMutation] = useMutation(CREATE_FINISHED_SCHEDULE_MEMBER, {
        refetchQueries: [
            { query: GET_MY_TEAM_FINISHED_SCHEDULES },
            { query: GET_MY_TEAM_TRAININGS},
            { query: GET_ONE_DAY_SCHEDULES, variables: { date: oneDay}
    }]})
    const [createGeneralUserFinishedScheduleMutation] = useMutation(CREATE_FINISHED_SCHEDULE_MEMBER, {
        refetchQueries: [
            { query: GET_MY_TEAM_TRAININGS},
            { query: GET_ONE_DAY_SCHEDULES, variables: { date: oneDay}
    }]})

    const createFinishedSchedule = useCallback(
        async (scheduleId: string, isCoach: boolean) => 
            isCoach ? (
                await createCoachUserFinishedScheduleMutation({ variables: { scheduleId } })
            ) : (
                await createGeneralUserFinishedScheduleMutation({ variables: { scheduleId } })
            )
         , [])

    return { createFinishedSchedule }
}