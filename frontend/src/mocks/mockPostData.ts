import moment from "moment"
import { graphql } from "msw"
import { CREATE_POST, DELETE_POST, GET_MORE_MY_TEAM_POSTS } from "../queries"

const mockMyPost = (id: number) => {
    return {
        id: String(id),
        text: `post${id}`,
        profile: {
            id: '1',
            nickname: 'coach user'
        },
        createdAt: moment().add(-id, 'days').toISOString()
    }
}

const mockOtherPost = (id: number) => {
    return {
        id: String(id),
        text: `post${id}`,
        profile: {
            id: '2',
            nickname: 'general user'
        },
        createdAt: moment().add(-id, 'days').toISOString()
    }
}

export const mockFirstMyTeamPostsQuery = { 
    request: {
        query: GET_MORE_MY_TEAM_POSTS,
        variables: {
            first: 10
        }
    },
    result: {
        data: {
            myTeamPosts: {
                edges: [
                    { node: mockMyPost(1) },
                    { node: mockMyPost(3) },
                    { node: mockMyPost(3) },
                    { node: mockMyPost(4) },
                    { node: mockMyPost(5) },
                    { node: mockOtherPost(6) },
                    { node: mockOtherPost(7) },
                    { node: mockOtherPost(8) },
                    { node: mockOtherPost(9) },
                    { node: mockOtherPost(10) },
                ],
                pageInfo: {
                    endCursor: '10',
                    hasNextPage: true
                }
            }
        }
    }
}


export const mockSecondMyTeamPostsQuery = {
    request: {
        query: GET_MORE_MY_TEAM_POSTS,
        variables: {
            first: 10, after: '10'
        }
    },
    result: {
        data: {
            myTeamPosts: {
                edges: [
                    { node: mockMyPost(11) },
                    { node: mockMyPost(12) }
                ],
                pageInfo: {
                    endCursor: '12',
                    hasNextPage: false
                }
            }
        }
    }
}

export const mockAbsentMyTeamPostsQuery = {
    request: {
        query: GET_MORE_MY_TEAM_POSTS,
        variables: {
            first: 10
        }
    },
    result: {
        data: {
            myTeamPosts: {
                edges: [],
                pageInfo: {
                    endCursor: '12',
                    hasNextPage: false
                }
            }
        }
    }
}

export const mockErrorMyTeamPostsQuery = {
    request: {
        query: GET_MORE_MY_TEAM_POSTS,
        variables: {
            first: 10
        }
    },
    error: new Error()
}

export const mockCreatePostMutation = {
    request: {
        query: CREATE_POST,
        variables: {
            text: 'post'
        }
    },
    result: {
        data: {
            createPost: {
                post: {
                    id: '1'
                }
            }
        }
    }
}

export const mockDeletePostMutation = {
    request: {
        query: DELETE_POST,
        variables: {
            postId: '1'
        }
    },
    result: {
        data: {
            deletePost: {
                post: {
                    id: null
                }
            }
        }
    }
}

export const mockGetMyTeamPostsHandler= graphql.query('MyTeamPosts', (req, res, ctx) => {
    const { first, after } = req.variables
    if (after === '10') {
        return res(
            ctx.data({
                myTeamPosts: {
                    edges: [
                        { node: mockMyPost(11) },
                        { node: mockMyPost(12) }
                    ],
                    pageInfo: {
                        endCursor: '12',
                        hasNextPage: false
                    }
                }
            })
        )
    }
    return res(
        ctx.data({
            myTeamPosts: {
                edges: [
                    { node: mockMyPost(1) },
                    { node: mockMyPost(3) },
                    { node: mockMyPost(3) },
                    { node: mockMyPost(4) },
                    { node: mockMyPost(5) },
                    { node: mockOtherPost(6) },
                    { node: mockOtherPost(7) },
                    { node: mockOtherPost(8) },
                    { node: mockOtherPost(9) },
                    { node: mockOtherPost(10) },
                ],
                pageInfo: {
                    endCursor: '10',
                    hasNextPage: true
                }
            }
        })
    )
})