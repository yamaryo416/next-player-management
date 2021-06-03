import '@testing-library/jest-dom/extend-expect'

import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react'
import { RecoilRoot } from 'recoil';
import { MockedProvider } from '@apollo/client/testing' 
import userEvent from '@testing-library/user-event'
import { MainMenubar } from '../components/templates/MainMenubar';
import { MyProfileEditModal } from '../components/organisms/modal/MyProfileEditModal';
import { mockMyProfileQuery, mockFirstMyTeamMemberQuery } from '../mocks/mockProfileData';
import { ConfirmTeamLeaveModal } from '../components/organisms/modal/ConfirmTeamLeaveModal';
import { ConfirmUserDeleteModal } from '../components/organisms/modal/ConfirmUserDeleteModal';
import { mockDeleteUserMutation } from '../mocks/mockUserData';
import { getPage, initTestHelpers } from 'next-page-tester';
import { setupServer } from 'msw/node'
import { TeamBoardPost } from '../components/organisms/team/TeamBoardPost';
import { mockCreatePostMutation, mockFirstMyTeamPostsQuery } from '../mocks/mockPostData';
import { MyTeamMemberDetailSection } from '../components/templates/MyTeamMemberDetailSection';
import { MyTeamMemberListSection } from '../components/templates/MyTeamMemberListSection';
import { mockMyTeamTrainingsQuery } from '../mocks/mockTrainingData';
import { mockMyFinishedSchedulesQuery, mockOtherFinishedScheduleQuery } from '../mocks/mockFinishedScheduleData';
import { ConfirmHandOffCoachModal } from '../components/organisms/modal/ConfirmHandOffCoachModal';
import { mockUpdateTeamBoardCoachMutation } from '../mocks/mockTeamBoardData';

jest.mock("next/router", () => ({
    useRouter() {
      return {
        push: () => null
      };
    }
  }));

afterEach(cleanup)

const mocks = [
    mockFirstMyTeamMemberQuery,
    mockMyProfileQuery(true, false),
    mockMyTeamTrainingsQuery,
    mockMyFinishedSchedulesQuery,
    mockOtherFinishedScheduleQuery,
    mockUpdateTeamBoardCoachMutation
]

describe('Hand off coach', () => {
    describe('Success', () => {
        it('Should display success message', async () => {
            render(
                <MockedProvider mocks={mocks} addTypename={false}>
                    <RecoilRoot>
                        <MyTeamMemberListSection />
                        <MyTeamMemberDetailSection />
                        <ConfirmHandOffCoachModal />
                    </RecoilRoot>
                </MockedProvider>
            )
            await new Promise(resolve => setTimeout(resolve, 1000));
            expect(screen.queryAllByText('user2')[0]).toBeInTheDocument()
            userEvent.click(await screen.findByTestId('2-member-detail-as-md'))
            expect(await screen.findByTestId('one-member-detail-nickname')).toHaveTextContent('user2')
            userEvent.click(screen.queryByTestId('confirm-hand-off-coach-button'))
            expect(await screen.findByTestId('hand-off-coach-user-name')).toHaveTextContent('ユーザー名: user2')
            userEvent.click(screen.queryByTestId('hand-off-coach-button'))
            expect(await screen.findByText('コーチ権限を委譲しました。')).toBeInTheDocument()
        })
    })
})