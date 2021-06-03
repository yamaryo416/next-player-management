import moment from "moment"
import { graphql } from 'msw'

import { GET_ONE_MEMBER_FINISHED_SCHEDULES } from "../queries"

export const mockFinishedSchedule = (id: string) => {
    return {
        schedule: {
            training: {
                id,
            },
            date: moment().format('YYYY-MM-DD')
        }
    }
}

export const mockFinishedScheduleWithProfile = (profileId: string, scheduleId: string, nickname: string) => {
    return {
        id: profileId,
        profile: {
            id: profileId,
            nickname
        },
        schedule: {
            id: scheduleId
        }
    }
}

export const mockMyFinishedSchedulesQuery = {
    request: {
        query: GET_ONE_MEMBER_FINISHED_SCHEDULES,
        variables: { }
    },
    result: {
        data: {
            myTeamFinishedSchedules: {
                edges: [
                    { node: mockFinishedSchedule('1') },
                ]
            }
        }
    }
}

export const mockOtherFinishedScheduleQuery = {
    request: {
        query: GET_ONE_MEMBER_FINISHED_SCHEDULES,
        variables: { id: '2'}
    },
    result: {
        data: {
            myTeamFinishedSchedules: {
                edges: [
                    { node: mockFinishedSchedule('1') },
                ]
            }
        }
    }
}

export const mockGetMyTeamFinishedSchedulesHandler = graphql.query('GetMyTeamFinishedSchedules', (req, res, ctx) => {
    return res(
        ctx.data({
            myTeamFinishedSchedules: {
                edges: [
                    { node: mockFinishedScheduleWithProfile('1', '1', 'coach user') }
                ]
            }
        })
    )
})

export const mockGetOneMemberFinishedSchedulesHandler = graphql.query('GetOneMemberFinishedSchedules', (req, res, ctx) => {
    return res(
        ctx.data({
            myTeamFinishedSchedules: {
                edges: [
                    { node: mockFinishedSchedule('1') }
                ]
            }
        })
    )
})



