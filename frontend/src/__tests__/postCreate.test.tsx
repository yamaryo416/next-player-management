import '@testing-library/jest-dom/extend-expect'

import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react'
import { RecoilRoot } from 'recoil';
import { MockedProvider } from '@apollo/client/testing' 
import userEvent from '@testing-library/user-event'
import { MainMenubar } from '../components/templates/MainMenubar';
import { MyProfileEditModal } from '../components/organisms/modal/MyProfileEditModal';
import { mockMyProfileQuery } from '../mocks/mockProfileData';
import { ConfirmTeamLeaveModal } from '../components/organisms/modal/ConfirmTeamLeaveModal';
import { ConfirmUserDeleteModal } from '../components/organisms/modal/ConfirmUserDeleteModal';
import { mockDeleteUserMutation } from '../mocks/mockUserData';
import { getPage, initTestHelpers } from 'next-page-tester';
import { setupServer } from 'msw/node'
import { TeamBoardPost } from '../components/organisms/team/TeamBoardPost';
import { mockCreatePostMutation, mockFirstMyTeamPostsQuery } from '../mocks/mockPostData';

afterEach(cleanup)

const mocks = [
    mockMyProfileQuery(true, false),
    mockFirstMyTeamPostsQuery,
    mockCreatePostMutation,
    mockFirstMyTeamPostsQuery
]

describe('Post create', () => {
    describe('Success', () => {
        it('Should display success message', async () => {
            render(
                <MockedProvider mocks={mocks} addTypename={false}>
                    <RecoilRoot>
                        <TeamBoardPost />
                    </RecoilRoot>
                </MockedProvider>
            )
            
            userEvent.type(await screen.findByTestId('post-text-form'), 'post')
            await new Promise(resolve => setTimeout(resolve, 1000));
            userEvent.click(screen.getByTestId('create-post-button'))
            expect(await screen.findByText('投稿しました。')).toBeInTheDocument()
        })
    })
})