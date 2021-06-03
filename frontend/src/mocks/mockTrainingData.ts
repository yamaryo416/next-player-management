import { graphql } from "msw"
import { CREATE_TRAINING, DELETE_TRAINING, GET_MY_TEAM_TRAININGS, UPDATE_TRAINING } from "../queries"

export const mockTrainingWithIcon = (id: string) => {
    return {
        id,
        title: `トレーニング${id}`,
        count: 10,
        load: 20,
        distance: 30,
        description: '',
        iconNumber: Number(id),
        finishedSchedules: {
            edges: []
        }
    }
}

export const mockTrainingWithoutIcon =  (id: string)  => {
    return {
        id,
        title: `アイコンなしトレーニング${id}`,
        count: 0,
        load: 0,
        distance: 0,
        description: '',
        iconNumber: 0,
        finishedSchedules: {
            edges: []
        }
    }
}

export const mockTrainingWithFinishedSchedules = (id: string) => {
    return {
        id,
        title: `トレーニング${id}`,
        count: 10,
        load: 20,
        distance: 30,
        description: '',
        iconNumber: Number(id),
        finishedSchedules: {
            edges: [
                {
                    node: {
                        profile: {
                            id: '1'
                        }
                    }
                }
            ]
        }
    }
}

export const mockOtherTeamTraining = (id: string)  => {
    return {
        title: `トレーニング${id}`,
        count: 10,
        load: 20,
        distance: 30,
        iconNumber: Number(id),
    }
}

export const mockTrainings = {
    edges: [
        { node: mockTrainingWithIcon('1') },
        { node: mockTrainingWithFinishedSchedules('2') },
        { node: mockTrainingWithIcon('3') },
        { node: mockTrainingWithIcon('4') },
        { node: mockTrainingWithIcon('5') },
        { node: mockTrainingWithIcon('6') },
        { node: mockTrainingWithIcon('7') },
        { node: mockTrainingWithIcon('8') },
        { node: mockTrainingWithIcon('9') },
        { node: mockTrainingWithIcon('10') },
        { node: mockTrainingWithIcon('11') },
    ]
}

export const mockAbsentTrainings = {
    edges: []
}


export const mockMyTeamTrainingsQuery = {
    request: {
        query: GET_MY_TEAM_TRAININGS,
    },
    result: {
        data: {
            myTeamTrainings: mockTrainings
        }
    }
}

export const mockErrorMyTeamTrainingQuery = {
    request: {
        query: GET_MY_TEAM_TRAININGS,
    },
    error: new Error()
}

export const mockCreateTrainingMutation = {
    request: {
        query: CREATE_TRAINING,
        variables: {
            title: 'トレーニング',
            count: 0,
            load: 0,
            distance: 0,
            description: '',
            iconNumber: 0
        }
    },
    result: {
        data: {
            createTraining: {
                training: {
                    id: '1'
                }
            }
        }
    }
}

export const mockUpdateTrainingMutation = {
    request: {
        query: UPDATE_TRAINING,
        variables: {
            trainingId: '1',
            title: 'トレーニング1 update',
            count: 10,
            load: 20,
            distance: 30,
            description: '',
            iconNumber: 1
        }
    },
    result: {
        data: {
            updateTraining: {
                training: {
                    id: '1'
                }
            }
        }
    }
}

export const mockDeleteTrainingMutation = {
    request: {
        query: DELETE_TRAINING,
        variables: {
          trainingId: '1'
        }
    },
    result: {
        data: {
            deleteTraining: {
                training: {
                    id: '1'
                }
            }
        }
    }
}

export const mockGetMyTeamTrainingsHandler= graphql.query('MyTeamTrainings', (req, res, ctx) => {
    return res(
        ctx.data({
            myTeamTrainings: mockTrainings
        })
    )
})