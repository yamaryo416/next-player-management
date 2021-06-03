import '@testing-library/jest-dom/extend-expect'

import { render, screen, cleanup } from '@testing-library/react'
import { RecoilRoot } from 'recoil';
import { MockedProvider } from '@apollo/client/testing' 
import userEvent from '@testing-library/user-event'

import { MainMenubar } from '../../../templates/MainMenubar';
import { mockMyProfileQuery } from '../../../../mocks/mockProfileData';
import { TeamEditModal } from '../TeamEditModal';

afterEach(cleanup)

describe('TeamEdithModal', () => {
    beforeEach(() => {
        render(
            <MockedProvider mocks={[ mockMyProfileQuery(true, false)]}>
                <RecoilRoot>
                    <MainMenubar
                        isJoinTeam={true}
                        isCoach={true}
                        isMyTeamPage={true}
                        isGuest={false}
                    />
                   <TeamEditModal />
                </RecoilRoot>
            </MockedProvider>
        )
        userEvent.click(screen.getByText('My Menu'))
        userEvent.click(screen.getByText('MyTeam Edit'))
    })

    it('Sould render correct content', async () => {
        expect(await screen.findByTestId('modal-title')).toHaveTextContent('チーム編集')
        expect(screen.queryByTestId('name-form')).toBeInTheDocument()
        expect(screen.queryByTestId('is-limit-join')).toBeInTheDocument()
        expect(screen.queryByTestId('introduction-form')).toBeInTheDocument()
        expect(screen.queryByTestId('team-edit-button')).toBeInTheDocument()
        expect(screen.queryByText('戻る')).toBeInTheDocument()
    })

    it('Should display error message becaouse name is blank', async () => {
        expect(await screen.findByTestId('modal-title')).toHaveTextContent('チーム編集')
        userEvent.clear(screen.queryByTestId('name-form'))
        userEvent.click(screen.queryByText('チーム編集'))
        expect(await screen.findByText('1文字以上入力してください。')).toBeInTheDocument()
        expect(screen.queryByTestId('team-edit-button')).toHaveAttribute('disabled')
    })

    it('Should display error message becaouse name is too long', async () => {
        expect(await screen.findByTestId('modal-title')).toHaveTextContent('チーム編集')
        userEvent.clear(screen.queryByTestId('name-form'))
        userEvent.type(screen.getByTestId('name-form'), 'a'.repeat(21))
        userEvent.click(screen.queryByText('チーム編集'))
        expect(await screen.findByText('20文字以内で入力してください。')).toBeInTheDocument()
        expect(screen.queryByTestId('team-edit-button')).toHaveAttribute('disabled')
    })

    it('Should display error message because password is blank', async () => {
        expect(await screen.findByTestId('modal-title')).toHaveTextContent('チーム編集')
        userEvent.click(screen.getByTestId('is-limit-join'))
        userEvent.clear(screen.getByTestId('password-form'))
        userEvent.click(screen.queryByText('チーム編集'))
        expect(await screen.findByText('パスワードは必須です。')).toBeInTheDocument()
        expect(screen.queryByTestId('team-edit-button')).toHaveAttribute('disabled')
    })

    it('Should display error message because password is invalid', async () => {
        expect(await screen.findByTestId('modal-title')).toHaveTextContent('チーム編集')
        userEvent.click(screen.getByTestId('is-limit-join'))
        userEvent.clear(await screen.findByTestId('password-form'))
        userEvent.type(screen.getByTestId('password-form'), 'hogehoge')
        userEvent.click(screen.queryByText('チーム編集'))
        expect(await screen.findByText('4桁の数字を入力してください。')).toBeInTheDocument()
        expect(screen.queryByTestId('team-edit-button')).toHaveAttribute('disabled')
    })


    it('Should display error message because introduction is too long', async () => {
        expect(await screen.findByTestId('modal-title')).toHaveTextContent('チーム編集')
        userEvent.type(screen.getByTestId('introduction-form'), 'a'.repeat(101))
        userEvent.click(screen.getByText('チーム編集'))
        expect(await screen.findByText('100文字以内で入力してください。')).toBeInTheDocument()
    })
})
