import '@testing-library/jest-dom/extend-expect'

import { cleanup, render, screen, waitFor } from '@testing-library/react'
import { RecoilRoot } from 'recoil';
import { MockedProvider } from '@apollo/client/testing' 
import userEvent from '@testing-library/user-event'
import moment from 'moment';

import { MainMenubar } from '../../../templates/MainMenubar';
import { mockMyTeamTrainingsQuery } from '../../../../mocks/mockTrainingData';
import { ScheduleDeleteModal } from '../ScheduleDeleteModal';
import { TODAY } from '../../../../../constants';

afterEach(cleanup)

describe('ScheduleDeleteModal', () => {
    beforeEach(() => {
        render(
            <MockedProvider mocks={[ mockMyTeamTrainingsQuery ]} >
                <RecoilRoot>
                    <MainMenubar
                        isJoinTeam={true}
                        isCoach={true}
                        isMyTeamPage={true}
                        isGuest={false}
                    />
                    <ScheduleDeleteModal />
                </RecoilRoot>
            </MockedProvider>
        )
        userEvent.click(screen.getByText('My Menu'))
        userEvent.click(screen.getByText('Delete Schedule'))
    })

    it('Should render correct contents', async () => {
        expect(await screen.findByTestId('modal-title')).toHaveTextContent('スケジュール削除')
        expect(await screen.findByTestId('startDate-form')).toBeInTheDocument()
        expect(screen.queryByTestId('endDate-form')).toBeInTheDocument()
        expect(screen.queryByTestId('change-training-select-mode-button')).toHaveTextContent('トレーニングを指定する')
        expect(screen.queryByTestId('confirm-schedule-delete-button')).toBeInTheDocument()
        expect(screen.queryByText('戻る')).toBeInTheDocument()
    })


    it('Should change training select mode after click change mode button', async () => {
        expect(await screen.findByTestId('modal-title')).toHaveTextContent('スケジュール削除')
        userEvent.click(screen.queryByTestId('change-training-select-mode-button'))
        expect(await screen.findByTestId('training-form')).toBeInTheDocument()
        expect(await screen.findByTestId('1-training')).toBeInTheDocument()
        expect(screen.queryByTestId('11-training')).toBeInTheDocument()
    })

    it('Should display error message because date is blank', async () => {
        expect(await screen.findByTestId('modal-title')).toHaveTextContent('スケジュール削除')
        userEvent.clear(screen.queryByTestId('startDate-form'))
        userEvent.click(screen.getByTestId('modal-title'))
        expect(await screen.findByText('日付を選択してください。')).toBeInTheDocument()
        expect(screen.queryByTestId('confirm-schedule-delete-button')).toHaveAttribute('disabled')
    })

    it('Should display error message because start date is past date', async () => {
        expect(await screen.findByTestId('modal-title')).toHaveTextContent('スケジュール削除')
        userEvent.clear(screen.queryByTestId('startDate-form'))
        userEvent.type(screen.queryByTestId('startDate-form'), moment(TODAY).add(-1, 'days').format('YYYY-MM-DD'))
        userEvent.click(screen.getByTestId('modal-title'))
        expect(await screen.findByText('過去の日付は選択できません。')).toBeInTheDocument()
        expect(screen.queryByTestId('confirm-schedule-delete-button')).toHaveAttribute('disabled')
    })


    it('Should display error message because date is blank', async () => {
        expect(await screen.findByTestId('modal-title')).toHaveTextContent('スケジュール削除')
        userEvent.clear(screen.queryByTestId('endDate-form'))
        userEvent.click(screen.getByTestId('modal-title'))
        expect(await screen.findByText('日付を選択してください。')).toBeInTheDocument()
        expect(screen.queryByTestId('confirm-schedule-delete-button')).toHaveAttribute('disabled')
    })

    it('Should display error message because start date is past date', async () => {
        expect(await screen.findByTestId('modal-title')).toHaveTextContent('スケジュール削除')
        userEvent.clear(screen.queryByTestId('endDate-form'))
        userEvent.type(screen.queryByTestId('endDate-form'), moment(TODAY).add(-1, 'days').format('YYYY-MM-DD'))
        userEvent.click(screen.getByTestId('modal-title'))
        expect(await screen.findByText('過去の日付は選択できません。')).toBeInTheDocument()
        expect(screen.queryByTestId('confirm-schedule-delete-button')).toHaveAttribute('disabled')
    })
})