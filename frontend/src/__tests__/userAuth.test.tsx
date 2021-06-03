import '@testing-library/jest-dom/extend-expect'

import { render, screen, waitFor, cleanup } from '@testing-library/react'
import { RecoilRoot } from 'recoil';
import { MockedProvider } from '@apollo/client/testing' 
import userEvent from '@testing-library/user-event'
import { HeaderForGeneralUser } from '../components/templates/HeaderForGeneralUser';
import { UserAuthModal } from '../components/organisms/modal/UserAuthModal';
import { mockCreateGeneralUserMutation, mockErrorTokenMutation, mockTokenMutation, mockErrorCreateGeneralUserMutation } from '../mocks/mockUserData';
import { TopContentsSection } from '../components/templates/TopContentsSection';
import { mockMyProfileQuery } from '../mocks/mockProfileData';
import { MainMenubar } from '../components/templates/MainMenubar';

jest.mock("next/router", () => ({
    useRouter() {
        return {
            push: () => null
        };
    }
}));

afterEach(cleanup)

describe('Login', () => {
    describe('False', () => {
        it('Should display error message because email or password not correct', async () => {
            render(
                <MockedProvider mocks={[ mockErrorTokenMutation ]} >
                    <RecoilRoot>
                        <TopContentsSection />
                        <UserAuthModal />
                    </RecoilRoot>
                </MockedProvider>
            )
            userEvent.click(screen.queryByText('ログイン'))
            userEvent.type(screen.getByTestId('email-form'), 'user@example.com')
            userEvent.type(screen.getByTestId('password-form'), 'password')
            await new Promise(resolve => setTimeout(resolve, 1000));
            userEvent.click(screen.queryByTestId('login-button'))
            expect(await screen.findByText('Eメール、もしくはパスワードが間違っています。')).toBeInTheDocument()
            expect(localStorage.getItem('token')).toBe(null)
        })
    })

    describe('Success', () => {
        it('Should display success message', async () => {
            render(
                <MockedProvider mocks={[ mockTokenMutation ]} >
                    <RecoilRoot>
                        <TopContentsSection />
                        <UserAuthModal />
                    </RecoilRoot>
                </MockedProvider>
            )
            userEvent.click(screen.queryByText('ログイン'))
            userEvent.type(screen.getByTestId('email-form'), 'user@example.com')
            userEvent.type(screen.getByTestId('password-form'), 'password')
            await new Promise(resolve => setTimeout(resolve, 1000));
            userEvent.click(screen.queryByTestId('login-button'))
            expect(await screen.findByText('ログインしました。')).toBeInTheDocument()
            expect(localStorage.getItem('token')).toBe("tokentoken")
        })
    })
})

describe('Signup', () => {
    describe('False', () => {
        beforeEach(() => {
            render(
                <MockedProvider mocks={[ mockErrorCreateGeneralUserMutation, mockTokenMutation ]} >
                    <RecoilRoot>
                        <TopContentsSection />
                        <UserAuthModal />
                    </RecoilRoot>
                </MockedProvider>
            )
            userEvent.click(screen.queryByText('新規登録'))
        })

        it('Should display error message because email is already used', async() => {
            userEvent.type(screen.getByTestId('email-form'), 'user@example.com')
            userEvent.type(screen.getByTestId('password-form'), 'password')
            userEvent.type(screen.getByTestId('password_confirmation-form'), 'password')
            await new Promise(resolve => setTimeout(resolve, 1000));
            userEvent.click(screen.queryByTestId('signup-button'))
            expect(await screen.findByText('Eメールは既に使われています。')).toBeInTheDocument()
        })
    })

    describe('Success', () => {
        it('Should success message', async () => {
            render(
                <MockedProvider mocks={[ mockCreateGeneralUserMutation, mockTokenMutation ]} >
                    <RecoilRoot>
                        <TopContentsSection />
                        <UserAuthModal />
                    </RecoilRoot>
                </MockedProvider>
            )
            userEvent.click(screen.queryByText('新規登録'))
            userEvent.type(screen.getByTestId('email-form'), 'user@example.com')
            userEvent.type(screen.getByTestId('password-form'), 'password')
            userEvent.type(screen.getByTestId('password_confirmation-form'), 'password')
            await new Promise(resolve => setTimeout(resolve, 1000));
            userEvent.click(screen.queryByTestId('signup-button'))
            expect(await screen.findByText('ユーザーを作成しました。')).toBeInTheDocument()
            expect(localStorage.getItem('token')).toBe("tokentoken")
        })
    })
})

describe('Logout', () => {
    describe('Success', () => {
        it('Should success message', async () => {
            localStorage.setItem('token', 'hogehoge')
            render(
                <MockedProvider mocks={[ mockMyProfileQuery(true, false) ]}>
                    <RecoilRoot>
                        <MainMenubar
                            isJoinTeam={true}
                            isCoach={true}
                            isMyTeamPage={true}
                            isGuest={false}
                        />
                    </RecoilRoot>
                </MockedProvider>
            )
            userEvent.click(screen.getByText('My Menu'))
            userEvent.click(screen.getByText('Logout'))
            expect(await screen.findByText('ログアウトしました。')).toBeInTheDocument()
            expect(localStorage.getItem('token')).toBe(null)
        })
    })
})