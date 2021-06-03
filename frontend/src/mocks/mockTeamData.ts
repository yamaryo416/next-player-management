import { CREATE_TEAM, GET_ONE_TEAM_FROM_NAME, UPDATE_TEAM } from "../queries";
import { graphql } from 'msw'
import { mockOtherTeamTraining } from "./mockTrainingData";
import { TODAY } from "../../constants";


export const mockOneTeamFromNameQuery = {
    request: {
        query: GET_ONE_TEAM_FROM_NAME,
        variables: {
            name: 'team',
            password: '0000'
        }
    },
    result: {
        data: {
            oneTeamFromName: {
                name: 'team',
                teamBoard: {
                    id: '1'
                }
            }
        }
    }
}

export const mockErrorOneTeamFromNameQuery = {
    request: {
        query: GET_ONE_TEAM_FROM_NAME,
        variables: {
            name: 'team',
            password: '0000'
        }
    },
    error: new Error()
}

export const mockCreateTeamMutation = {
    request: {
        query: CREATE_TEAM,
        variables: {
            name: 'team',
            isLimitJoin: false,
            password: '0000',
        }
    },
    result: {
        data: {
            createTeam: {
                team: {
                    id: '1'
                }
            }
        }
    }
}

export const mockErrorCreateTeamMutation = {
    request: {
        query: CREATE_TEAM,
        variables: {
            name: 'team',
            isLimitJoin: false,
            password: '0000',
        }
    },
    error: new Error()
}

export const mockUpdateTeamMutation = {
    request: {
        query: UPDATE_TEAM,
        variables: {
            name: 'team update',
            isLimitJoin: false,
            password: '0000'
        }
    },
    result: {
        data: {
            updateTeam: {
                team: {
                    id: '1'
                }
            }
        }
    }
}

export const mockGetOneTeamFromIdHandler = graphql.query('OneTeamFromId', (req, res, ctx) => {
    return res(
        ctx.data({
            oneTeamFromId: {
                id: '1',
                name: 'team',
                teamBoard: {
                    id: '1',
                    introduction: 'よろしくお願いします。',
                    joinCount: 2,
                    coach: 'coach user',
                    schedules: {
                        edges: [
                            { node: { id: '1', training: mockOtherTeamTraining('1') }, date: TODAY },
                            { node: { id: '1', training: mockOtherTeamTraining('2') }, date: TODAY }
                        ]
                    },
                    trainings: {
                        edges: [
                            { node: mockOtherTeamTraining('3') },
                            { node: mockOtherTeamTraining('4') }
                        ]
                    }
                }
            }
        })
    )
})