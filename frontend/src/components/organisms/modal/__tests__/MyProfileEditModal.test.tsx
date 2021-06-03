import '@testing-library/jest-dom/extend-expect'

import { render, screen, cleanup } from '@testing-library/react'
import { RecoilRoot } from 'recoil';
import { MockedProvider } from '@apollo/client/testing' 
import userEvent from '@testing-library/user-event'

import { MainMenubar } from '../../../templates/MainMenubar';
import { MyProfileEditModal } from '../MyProfileEditModal';
import { mockMyProfileQuery, mockMyProfileWithoutTeamBoardQuery, mockUpdateMyProfileNicknameMutation } from '../../../../mocks/mockProfileData';

afterEach(cleanup)

const mocksAsCoach = [
    mockMyProfileQuery(true, false),
    mockUpdateMyProfileNicknameMutation 
]

const mocksAsGeneral = [
    mockMyProfileQuery(false, false),
    mockUpdateMyProfileNicknameMutation 
]

const mocksAsNotJoinTeam = [
    mockMyProfileWithoutTeamBoardQuery(false, false),
    mockUpdateMyProfileNicknameMutation
]

describe('MyProfileEdithModal', () => {
    describe('As Coach', () => {
        beforeEach(() => {
            render(
                <MockedProvider mocks={mocksAsCoach}>
                    <RecoilRoot>
                        <MainMenubar
                            isJoinTeam={true}
                            isCoach={true}
                            isMyTeamPage={false}
                            isGuest={false}
                        />
                        <MyProfileEditModal />
                    </RecoilRoot>
                </MockedProvider>
            )
            userEvent.click(screen.getByText('My Menu'))
            userEvent.click(screen.getByText('Profile Edit'))
        })

        it('Sould render correct content', async () => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            expect(screen.getByTestId('modal-title')).toHaveTextContent('プロフィール編集')
            expect(screen.queryByText('チームから脱退する')).toBeInTheDocument()
            expect(screen.queryByText('アカウントを削除する')).toBeInTheDocument()
            expect(screen.queryByText('戻る')).toBeInTheDocument()
        })

        it('Should display error message because click team leave button', async () => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            userEvent.click(screen.getByText('チームから脱退する'))
            await new Promise(resolve => setTimeout(resolve, 1000));
            expect(screen.queryAllByText('コーチの権限を他のユーザーに委譲してください。')[0]).toBeInTheDocument()
        })

        it('Should display error message because click account delete button', async () => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            userEvent.click(screen.getByText('アカウントを削除する'))
            await new Promise(resolve => setTimeout(resolve, 1000));
            expect(screen.queryAllByText('コーチの権限を他のユーザーに委譲してください。')[0]).toBeInTheDocument()
        })

        it('Should display error message becaouse nickname is blank', async () => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            userEvent.clear(screen.queryByTestId('nickname-form'))
            userEvent.click(screen.queryByText('プロフィール編集'))
            await new Promise(resolve => setTimeout(resolve, 1000));
            expect(screen.queryByText('1文字以上入力してください。')).toBeInTheDocument()
            expect(screen.queryByTestId('profile-edit-button')).toHaveAttribute('disabled')
        })

        it('Should display error message becaouse nickname is blank', async () => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            userEvent.clear(screen.queryByTestId('nickname-form'))
            userEvent.type(screen.queryByTestId('nickname-form'), 'a'.repeat(21))
            userEvent.click(screen.queryByText('プロフィール編集'))
            await new Promise(resolve => setTimeout(resolve, 1000));
            expect(screen.queryByText('20文字以内で入力してください')).toBeInTheDocument()
            expect(screen.queryByTestId('profile-edit-button')).toHaveAttribute('disabled')
        })
    })

    describe('As General User', () => {
        it('Sould render correct content', async () => {
            render(
                <MockedProvider mocks={mocksAsGeneral}>
                    <RecoilRoot>
                        <MainMenubar
                            isJoinTeam={true}
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
            await new Promise(resolve => setTimeout(resolve, 1000));
            expect(screen.getByText('プロフィール編集')).toBeInTheDocument()
            expect(screen.queryByText('チームから脱退する')).toBeInTheDocument()
            expect(screen.queryByText('アカウントを削除する')).toBeInTheDocument()
            expect(screen.queryByText('戻る')).toBeInTheDocument()
        })
    })

    describe('As Not Join Team User', () => {
        it('Sould render correct content', async () => {
            render(
                <MockedProvider mocks={mocksAsNotJoinTeam} >
                    <RecoilRoot>
                        <MainMenubar
                            isJoinTeam={true}
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
            await new Promise(resolve => setTimeout(resolve, 1000));
            expect(screen.getByText('プロフィール編集')).toBeInTheDocument()
            expect(screen.queryByText('チームから脱退する')).not.toBeInTheDocument()
            expect(screen.queryByText('アカウントを削除する')).toBeInTheDocument()
            expect(screen.queryByText('戻る')).toBeInTheDocument()
        })
    })
})

