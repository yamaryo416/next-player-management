import '@testing-library/jest-dom/extend-expect'

import { render, screen, cleanup, waitFor } from '@testing-library/react'
import { RecoilRoot } from 'recoil';
import { MockedProvider } from '@apollo/client/testing' 
import userEvent from '@testing-library/user-event'

import { MainMenubar } from '../components/templates/MainMenubar';
import { MyProfileEditModal } from '../components/organisms/modal/MyProfileEditModal';
import { mockMyProfileQuery, mockUpdateMyProfileNicknameMutation } from '../mocks/mockProfileData';

afterEach(cleanup)

const mocks = [
    mockMyProfileQuery(false, false),
    mockUpdateMyProfileNicknameMutation
]

describe('Profile Edit', () => {
    describe('Success', () => {
        it('Should display success message', async () => {
            render(
                <MockedProvider mocks={mocks} >
                    <RecoilRoot>
                        <MainMenubar
                            isJoinTeam={false}
                            isCoach={false}
                            isMyTeamPage={false}
                            isGuest={false}
                        />
                        <MyProfileEditModal />
                    </RecoilRoot>
                </MockedProvider>
            )
            userEvent.click(screen.getByText('My Menu'))
            userEvent.click(screen.getByText('Profile Edit'))
            expect(await screen.findByText('プロフィール編集')).toBeInTheDocument()
            userEvent.clear(screen.getByTestId('nickname-form'))
            userEvent.type(screen.getByTestId('nickname-form'), 'user update')
            userEvent.click(screen.getByTestId('profile-edit-button'))
            await waitFor(() => expect(screen.queryAllByText('プロフィールを編集しました。')[0]).toBeInTheDocument())
        })
    })
})