import '@testing-library/jest-dom/extend-expect'

import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react'
import { RecoilRoot } from 'recoil';
import { MockedProvider } from '@apollo/client/testing' 
import userEvent from '@testing-library/user-event'
import { MainMenubar } from '../components/templates/MainMenubar';
import { MyProfileEditModal } from '../components/organisms/modal/MyProfileEditModal';
import { mockDeleteMyProfileTeamBoardMutation, mockMyProfileQuery, mockMyProfileWithoutTeamBoardQuery, mockUpdateMyProfileNicknameMutation, mockFirstMyTeamMemberQuery, mockDeleteOneProfileTeamBoardMutation, mockMyTeamMember } from '../mocks/mockProfileData';
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

afterEach(cleanup)

jest.mock("next/router", () => ({
    useRouter() {
      return {
        push: () => null
      };
    }
  }));

const mocksMyProfileTeamLeave = [
    mockMyProfileQuery(false, false),
    mockDeleteMyProfileTeamBoardMutation,
    mockFirstMyTeamMemberQuery,
    mockMyProfileQuery(false, false),
]

const mocksMyTeamMemberTeamLeave = [
    mockFirstMyTeamMemberQuery,
    mockMyProfileQuery(true, false),
    mockMyTeamTrainingsQuery,
    mockMyFinishedSchedulesQuery,
    mockOtherFinishedScheduleQuery,
    mockDeleteOneProfileTeamBoardMutation,
    mockFirstMyTeamMemberQuery,
]

describe('Team leave', () => {
    describe('My profile', () => {
        describe('Success', () => {
            it('Should display success message', async () => {
                render(
                    <MockedProvider mocks={mocksMyProfileTeamLeave} >
                        <RecoilRoot>
                            <MainMenubar
                                isJoinTeam={true}
                                isCoach={false}
                                isMyTeamPage={true}
                                isGuest={false}
                            />
                            <MyProfileEditModal />
                            <ConfirmTeamLeaveModal />
                        </RecoilRoot>
                    </MockedProvider>
                )
                userEvent.click(await screen.findByText('My Menu'))
                userEvent.click(await screen.findByText('Profile Edit'))
                userEvent.click(await screen.findByTestId('confirm-team-leave-button'))
                userEvent.click(await screen.findByTestId('team-leave-button'))
                expect(await screen.findByText('チームから脱退しました。')).toBeInTheDocument()
            })
        })
    })

    describe('My team member', () => {
        describe('Success', () => {
            it('Should display success message', async () => {
                render(
                    <MockedProvider mocks={mocksMyTeamMemberTeamLeave} >
                        <RecoilRoot>
                            <MyTeamMemberListSection />
                            <MyTeamMemberDetailSection />
                            <ConfirmTeamLeaveModal />
                        </RecoilRoot>
                    </MockedProvider>
                )
                await new Promise(resolve => setTimeout(resolve, 1000));
                expect(screen.queryAllByText('user2')[0]).toBeInTheDocument()
                userEvent.click(await screen.findByTestId('2-member-detail-as-md'))
                expect(await screen.findByTestId('one-member-detail-nickname')).toHaveTextContent('user2')
                userEvent.click(screen.queryByTestId('confirm-team-leave-button'))
                expect(await screen.findByTestId('team-leave-user-name')).toHaveTextContent('ニックネーム: user2')
                userEvent.click(screen.queryByTestId('team-leave-button'))
                expect(await screen.findByText('ユーザーを脱退させました。')).toBeInTheDocument()
            })
        })
    })
})