import { CREATE_GENERAL_USER, DELETE_USER, GET_TOKEN } from "../queries";

export const mockTokenMutation = {
    request: {
        query: GET_TOKEN,
        variables: {
            email: 'user@example.com',
            password: 'password'
        }
    },
    result: {
        data: {
            tokenAuth: {
                token: 'tokentoken'
            }
        }
    }
}

export const mockErrorTokenMutation = {
    request: {
        query: GET_TOKEN,
        variables: {
            email: 'user@example.com',
            password: 'password'
        }
    },
    error: new Error('credentials')
}

export const mockCreateGeneralUserMutation = {
    request: {
        query: CREATE_GENERAL_USER,
        variables: {
            nickname: '名無し',
            email: 'user@example.com',
            password: 'password'
        }
    },
    result: {
        data: {
            createGeneralUser: {
                user: {
                    id: '1'
                }
            }
        }
    }
}

export const mockErrorCreateGeneralUserMutation = {
    request: {
        query: CREATE_GENERAL_USER,
        variables: {
            nickname: '名無し',
            email: 'user@example.com',
            password: 'password'
        }
    },
    error: new Error('duplicate')
}

export const mockDeleteUserMutation = {
    request: {
        query: DELETE_USER,
        variables: {
            confirm: true
        }
    },
    result: {
        data: {
            deleteUser: {
                user: {
                    id: null
                }
            }
        }
    }
}