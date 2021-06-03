import '@testing-library/jest-dom/extend-expect'

import { cleanup, render, screen } from '@testing-library/react'
import { RecoilRoot } from 'recoil';
import { MockedProvider } from '@apollo/client/testing' 
import userEvent from '@testing-library/user-event'

import { TopContentsSection } from '../../../templates/TopContentsSection';
import { UserAuthModal } from '../UserAuthModal';

afterEach(cleanup)

describe('UserAuthModal', () => {
    beforeEach(() => {
        render(
            <MockedProvider>
                <RecoilRoot>
                    <TopContentsSection />
                    <UserAuthModal />
                </RecoilRoot>
            </MockedProvider>
        )
    })

    it('Should display login modal', () => {
        expect(screen.queryByTestId('modal-title')).not.toBeInTheDocument()
        userEvent.click(screen.queryByText('ログイン'))
        expect(screen.queryByTestId('modal-title')).toHaveTextContent('ログイン')
        expect(screen.queryByText('アカウントを持っていない場合はこちら')).toBeInTheDocument()
        expect(screen.queryByText('既にアカウントを持っている場合はこちら')).not.toBeInTheDocument()
        expect(screen.queryByText('戻る')).toBeInTheDocument()
    })

    it('Should display signup modal', () => {
        userEvent.click(screen.queryByText('新規登録'))
        expect(screen.queryByTestId('modal-title')).toHaveTextContent('新規登録')
        expect(screen.queryByText('アカウントを持っていない場合はこちら')).not.toBeInTheDocument()
        expect(screen.queryByText('既にアカウントを持っている場合はこちら')).toBeInTheDocument()
        expect(screen.queryByText('戻る')).toBeInTheDocument()
    })

    it('Should change mode after change mode button', () => {
        userEvent.click(screen.queryByText('ログイン'))
        userEvent.click(screen.queryByText('アカウントを持っていない場合はこちら'))
        expect(screen.queryByTestId('modal-title')).toHaveTextContent('新規登録')
        userEvent.click(screen.queryByText('既にアカウントを持っている場合はこちら'))
        expect(screen.queryByTestId('modal-title')).toHaveTextContent('ログイン')
    })

    it('Should display error message because nickname is blank', async() => {
        userEvent.click(screen.queryByText('新規登録'))
        userEvent.clear(screen.getByTestId('nickname-form'))
        userEvent.click(screen.getByTestId('nickname-form'))
        userEvent.type(screen.getByTestId('email-form'), 'user@example.com')
        userEvent.type(screen.getByTestId('password-form'), 'password')
        userEvent.type(screen.getByTestId('password_confirmation-form'), 'password')
        expect(await screen.findByText('1文字以上入力してください。')).toBeInTheDocument()
        expect(screen.queryByTestId('signup-button')).toHaveAttribute('disabled')
    })

    it('Should display error message because nickname is too long', async() => {
        userEvent.click(screen.queryByText('新規登録'))
        userEvent.clear(screen.getByTestId('nickname-form'))
        userEvent.type(screen.getByTestId('nickname-form'), 'a'.repeat(21))
        userEvent.type(screen.getByTestId('email-form'), 'user@example.com')
        userEvent.type(screen.getByTestId('password-form'), 'password')
        userEvent.type(screen.getByTestId('password_confirmation-form'), 'password')
        expect(await screen.findByText('20文字以内で入力してください')).toBeInTheDocument()
        expect(screen.queryByTestId('signup-button')).toHaveAttribute('disabled')
    })

    it('Should display error message because password is not match', async() => {
        userEvent.click(screen.queryByText('新規登録'))
        userEvent.type(screen.getByTestId('email-form'), 'user@example.com')
        userEvent.type(screen.getByTestId('password-form'), 'password')
        userEvent.type(screen.getByTestId('password_confirmation-form'), 'hogehoge')
        await new Promise(resolve => setTimeout(resolve, 1000));
        userEvent.click(screen.queryByTestId('signup-button'))
        expect(await screen.findByText('パスワードが一致しません。')).toBeInTheDocument()
    })

    it('Should display error message because email blank', async() => {
        userEvent.click(screen.queryByText('ログイン'))
        userEvent.type(screen.getByTestId('email-form'), '')
        userEvent.type(screen.getByTestId('password-form'), 'password')
        expect(await screen.findByText('Emailは必須です。')).toBeInTheDocument()
        expect(screen.queryByTestId('login-button')).toHaveAttribute('disabled')
    })


    it('Should display error message because email invalid', async() => {
        userEvent.click(screen.queryByText('ログイン'))
        userEvent.type(screen.getByTestId('email-form'), 'invalid')
        userEvent.type(screen.getByTestId('password-form'), 'password')
        expect(await screen.findByText('正しいEmailを入力してください。')).toBeInTheDocument()
        expect(screen.queryByTestId('login-button')).toHaveAttribute('disabled')
    })

    it('Should display error message because password blank', async() => {
        userEvent.click(screen.queryByText('ログイン'))
        userEvent.type(screen.getByTestId('password-form'), '')
        userEvent.type(screen.getByTestId('email-form'), 'user@example.com')
        expect(await screen.findByText('パスワードは必須です。')).toBeInTheDocument()
        expect(screen.queryByTestId('login-button')).toHaveAttribute('disabled')
    })

    it('Should display error message because password too short', async() => {
        userEvent.click(screen.queryByText('ログイン'))
        userEvent.type(screen.getByTestId('password-form'), 'a')
        userEvent.type(screen.getByTestId('email-form'), 'user@example.com')
        userEvent.click(screen.getByTestId('email-form'))
        expect(await screen.findByText('6文字以上で入力してください')).toBeInTheDocument()
        expect(screen.queryByTestId('login-button')).toHaveAttribute('disabled')
    })

})