import moment from "moment"
import { graphql } from "msw"

import { TODAY } from "../../constants"
import { CREATE_MANY_SCHEDULES, CREATE_SINGLE_SCHEDULE, DELETE_MANY_SCHEDULES, DELETE_SCHEDULE, GET_MY_TEAM_SCHEDULES, GET_ONE_DAY_SCHEDULES } from "../queries"
import { mockTrainingWithIcon, mockTrainingWithoutIcon } from "./mockTrainingData"

export const mockSchedule = (id: string) => {
    return {
        id,
        date: TODAY,
        training: mockTrainingWithIcon(id),
        finishedCount: 1,
        finishedSchedules: {
            edges: [
                { node:
                    { profile: 
                        {
                            id: '1',
                            nickname: 'coach user'
                        }
                    }
                }
            ]
        }
    }
}

export const mockScheduleWithoutFinishedMember = (id: string) => {
    return {
        id,
        date: TODAY,
        training: mockTrainingWithIcon(id),
        finishedCount: 0,
        finishedSchedules: {
            edges: null
        }
    }
}


export const mockScheduleWithoutIcon = (id: string) => {
    return {
        id,
        date: TODAY,
        training: mockTrainingWithoutIcon(id),
        finishedCount: 0,
        finishedSchedules: {
            edges: null
        }
    }
}

export const mockPreviousDateScheduleWithFinisheMember = (id: string) => {
    return {
        id,
        date: moment(TODAY).add(-1, 'days').format("YYYY-MM-DD"),
        training: mockTrainingWithIcon(id),
        finishedCount: 1,
        finishedSchedules: {
            edges: [
                { node:
                    { profile: 
                        {
                            id: '1',
                            nickname: 'coach user'
                        }
                    }
                }
            ]
        }
    }
}

export const mockPreviousDateScheduleWithoutFinisheMember = (id: string) => {
    return {
        id,
        date: moment(TODAY).add(-1, 'days').format("YYYY-MM-DD"),
        training: mockTrainingWithIcon(id),
        finishedCount: 0,
        finishedSchedules: {
            edges: null
        }
    }
}

export const mockNextDateSchedule = (id: string) => {
    return {
        id,
        date: moment(TODAY).add(1, 'days').format("YYYY-MM-DD"),
        training: mockTrainingWithIcon(id),
        finishedCount: 0,
        finishedSchedules: {
            edges: null
        }
    }
}

export const mockNextWeekSchedule = (id: string) => {
    return {
        id,
        date: moment(TODAY).add(7, 'days').format("YYYY-MM-DD"),
        training: mockTrainingWithIcon(id),
        finishedCount: 0,
        finishedSchedules: {
            edges: null
        }
    }
}


export const mockSchedules = {
    edges: [
        { node: mockSchedule('1') },
        { node: mockNextDateSchedule('2') },
        { node: mockPreviousDateScheduleWithoutFinisheMember('3') },
        { node: mockNextWeekSchedule('4') },
        { node: mockScheduleWithoutIcon('5') },
    ]
}

export const mockTodaySchedulesQuery = {
    request: {
        query: GET_ONE_DAY_SCHEDULES,
        variables: {
            date: TODAY
        },
    },
    result: {
        data: {
            myTeamSchedules: {
                edges: [
                    { node: mockSchedule('1') },
                    { node: mockScheduleWithoutIcon('2') }
                ]
            }
        }
    }
}

export const mockPreviousSchedulesQuery = {
    request: {
        query: GET_ONE_DAY_SCHEDULES,
        variables: {
            date: moment(TODAY).add(-1, 'days').format('YYYY-MM-DD')
        },
    },
    result: {
        data: {
            myTeamSchedules: {
                edges: [
                    { node: mockPreviousDateScheduleWithFinisheMember('1') },
                    { node: mockPreviousDateScheduleWithoutFinisheMember('2') }
                ]
            }
        }
    }
}

export const mockNextSchedulesQuery = {
    request: {
        query: GET_ONE_DAY_SCHEDULES,
        variables: {
            date: moment(TODAY).add(1, 'days').format('YYYY-MM-DD')
        },
    },
    result: {
        data: {
            myTeamSchedules: {
                edges: [
                    { node: mockNextDateSchedule('1') }
                ]
            }
        }
    }
}

export const MockAbsentShcduleQuery = {
    request: {
        query: GET_ONE_DAY_SCHEDULES,
        variables: {
            date: TODAY
        },
    },
    result: {
        data: {
            myTeamSchedules: {
                edges: []
            }
        }
    }
}

export const mockErrorScheduleQuery = {
    request: {
        query: GET_ONE_DAY_SCHEDULES,
        variables: {
            date: TODAY
        },
    },
    error: new Error()
}

export const mockMyTeamSchedulesQuery = {
    request: {
        query: GET_MY_TEAM_SCHEDULES,
    },
    result: {
        data: {
            myTeamSchedules: {
                edges: [
                    { node: mockSchedule('1') },
                    { node: mockNextWeekSchedule('2') },
                ]
            }
        }
    }
}

export const mockErrorMyTeamScheduleQuery = {
    request: {
        query: GET_ONE_DAY_SCHEDULES,
        variables: {
            date: moment(TODAY).format('YYYY-MM-DD')
        },
    },
    error: new Error()
}

export const mockCreateSingleScheduleMutation = {
    request: {
        query: CREATE_SINGLE_SCHEDULE,
        variables: {
            trainingId: '1',
            date: TODAY,
        },
    },
    result: {
        data: {
            createSchedule: {
                id: '1'
            }
        }
    }
}

export const mockCreateManySchedulesMutation = {
    request: {
        query: CREATE_MANY_SCHEDULES,
        variables: {
            trainingId: '1',
            startDate: TODAY,
            endDate: moment(TODAY).add(7, 'days').format('YYYY-MM-DD'),
            dayOfWeek: '0123456'
        },
    },
    result: {
        data: {
            createManySchedules: {
                schedule: {
                    id: '1'
                }
            }
        }
    }
}

export const mockDeleteScheduleMutation = {
    request: {
        query: DELETE_SCHEDULE,
        variables: {
            scheduleId: '1'
        }
    },
    result: {
        data: {
            deleteSchedule: {
                schedule: {
                    id: '1'
                }
            }
        }
    }
}

export const mockDeleteManySchedulesMutation = {
    request: {
        query: DELETE_MANY_SCHEDULES,
        variables: {
            startDate: TODAY,
            endDate: moment(TODAY).add(7, 'days').format('YYYY-MM-DD')
        }
    },
    result: {
        data: {
            deleteManySchedules: {
                schedule: {
                    id: ''
                }
            }
        }
    }
}

export const mockGetMyTeamSchedulesHandler = graphql.query('MyTeamSchedules', (req, res, ctx) => {
    return res(
        ctx.data({
            myTeamSchedules: {
                edges: [
                    { node: mockSchedule('1') },
                    { node: mockScheduleWithoutIcon('2') },
                    { node: mockNextDateSchedule('3') },
                    { node: mockPreviousDateScheduleWithoutFinisheMember('4') },
                    { node: mockNextWeekSchedule('5') },
                ]
            }
        })
    )
})

export const mockGetOneDaySchedulesHandler = graphql.query('OneDaySchedules', (req, res, ctx) => {
    const { date } = req.variables

    if (date === moment(TODAY).add(1, 'days').format('YYYY-MM-DD')) {
        return res(
            ctx.data({
                myTeamSchedules: {
                    edges: [
                        { node: mockNextDateSchedule('3') }
                    ]
                }
            })
        )
    }
    if (date === TODAY) {
        return res(
            ctx.data({
                myTeamSchedules: {
                    edges: [
                        { node: mockSchedule('1') },
                        { node: mockScheduleWithoutIcon('2') }
                    ]
                }
            })
        )
    }
    if (date === moment(TODAY).add(-1, 'days').format('YYYY-MM-DD')) {
        return res(
            ctx.data({
                myTeamSchedules: {
                    edges: [
                        { node: mockPreviousDateScheduleWithoutFinisheMember('4') }
                    ]
                }
            })
        )
    }
})