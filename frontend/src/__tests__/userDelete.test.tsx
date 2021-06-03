import '@testing-library/jest-dom/extend-expect'

import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react'
import { RecoilRoot } from 'recoil';
import { MockedProvider } from '@apollo/client/testing' 
import userEvent from '@testing-library/user-event'
import { MainMenubar } from '../components/templates/MainMenubar';
import { MyProfileEditModal } from '../components/organisms/modal/MyProfileEditModal';
import { mockDeleteMyProfileTeamBoardMutation, mockMyProfileQuery, mockMyProfileWithoutTeamBoardQuery, mockUpdateMyProfileNicknameMutation } from '../mocks/mockProfileData';
import { ConfirmTeamLeaveModal } from '../components/organisms/modal/ConfirmTeamLeaveModal';
import { ConfirmUserDeleteModal } from '../components/organisms/modal/ConfirmUserDeleteModal';
import { mockDeleteUserMutation } from '../mocks/mockUserData';
import { getPage, initTestHelpers } from 'next-page-tester';
import { setupServer } from 'msw/node'

import * as nextRouter from 'next/router'

jest.mock("next/router", () => ({
    useRouter() {
      return {
        push: () => null
      };
    }
  }));

const mocks = [
    mockMyProfileQuery(false, false),
    mockDeleteUserMutation
]

describe('User Delete', () => {
    describe('Success', () => {
        it('Should display success message', async () => {
            render(
                <MockedProvider mocks={mocks} >
                    <RecoilRoot>
                        <MainMenubar
                            isJoinTeam={true}
                            isCoach={false}
                            isMyTeamPage={false}
                            isGuest={false}
                        />
                        <MyProfileEditModal />
                        <ConfirmUserDeleteModal />
                    </RecoilRoot>
                </MockedProvider>
            )
            userEvent.click(screen.getByText('My Menu'))
            userEvent.click(screen.getByText('Profile Edit'))
            expect(await screen.findByText('プロフィール編集')).toBeInTheDocument()
            userEvent.click(screen.getByTestId('confirm-user-delete-button'))
            userEvent.click(await screen.findByTestId('user-delete-button'))
            expect(await screen.findByText('ユーザーを削除しました。')).toBeInTheDocument()
        })
    })
})