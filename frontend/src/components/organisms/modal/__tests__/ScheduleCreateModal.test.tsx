import '@testing-library/jest-dom/extend-expect'

import { cleanup, render, screen, waitFor } from '@testing-library/react'
import { RecoilRoot } from 'recoil';
import { MockedProvider } from '@apollo/client/testing' 
import userEvent from '@testing-library/user-event'
import moment from 'moment';

import { MainMenubar } from '../../../templates/MainMenubar';
import { ScheduleCreateModal } from '../ScheduleCreateModal';
import { mockMyTeamTrainingsQuery } from '../../../../mocks/mockTrainingData';
import { TODAY } from '../../../../../constants';

afterEach(cleanup)

describe('ScheduleCreateModal', () => {
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
                    <ScheduleCreateModal />
                </RecoilRoot>
            </MockedProvider>
        )
        userEvent.click(screen.getByText('My Menu'))
        userEvent.click(screen.getByText('Create Schedule'))
    })

    it('Should render correct contents', async () => {
        expect(await screen.findByTestId('modal-title')).toHaveTextContent('スケジュール作成(一日のみ)')
        expect(await screen.findByTestId('training-form')).toBeInTheDocument()
        expect(await screen.findByTestId('1-training')).toBeInTheDocument()
        expect(screen.queryByTestId('11-training')).toBeInTheDocument()
        expect(screen.queryByTestId('date-form')).toBeInTheDocument()
        expect(screen.queryByTestId('schedule-create-button')).toBeInTheDocument()
        expect(screen.queryByTestId('change-create-schedule-mode-button')).toHaveTextContent('期間指定に切り替える')
        expect(screen.queryByText('戻る')).toBeInTheDocument()
    })


    it('Should change create many schedule mode after click change mode button', async () => {
        expect(await screen.findByTestId('modal-title')).toHaveTextContent('スケジュール作成(一日のみ)')
        userEvent.click(screen.queryByTestId('change-create-schedule-mode-button'))
        expect(await screen.findByTestId('modal-title')).toHaveTextContent('スケジュール作成(期間指定)')
        expect(screen.queryByTestId('startDate-form')).toBeInTheDocument()
        expect(screen.queryByTestId('endDate-form')).toBeInTheDocument()
        expect(screen.queryByTestId('week-0')).toBeInTheDocument()
        expect(screen.queryByTestId('week-6')).toBeInTheDocument()
        expect(screen.queryByTestId('change-create-schedule-mode-button')).toHaveTextContent('一日のみに切り替える')
    })

    it('Should display error message because not select training', async () => {
        expect(await screen.findByTestId('modal-title')).toHaveTextContent('スケジュール作成(一日のみ)')
        userEvent.selectOptions(await screen.findByTestId('training-form'), screen.queryByTestId('not-training'))
        userEvent.click(screen.getByTestId('modal-title'))
        expect(await screen.findByText('トレーニングを選択してください')).toBeInTheDocument()
        expect(screen.queryByTestId('schedule-create-button')).toHaveAttribute('disabled')
    })

    it('Should display error message because date is blank', async () => {
        expect(await screen.findByTestId('modal-title')).toHaveTextContent('スケジュール作成(一日のみ)')
        userEvent.clear(screen.queryByTestId('date-form'))
        userEvent.click(screen.getByTestId('modal-title'))
        expect(await screen.findByText('日付を選択してください。')).toBeInTheDocument()
        expect(screen.queryByTestId('schedule-create-button')).toHaveAttribute('disabled')
    })

    it('Should display error message because date is past date', async () => {
        expect(await screen.findByTestId('modal-title')).toHaveTextContent('スケジュール作成(一日のみ)')
        userEvent.clear(screen.queryByTestId('date-form'))
        userEvent.type(screen.queryByTestId('date-form'), moment(TODAY).add(-1, 'days').format('YYYY-MM-DD'))
        userEvent.click(screen.getByTestId('modal-title'))
        expect(await screen.findByText('過去の日付は選択できません。')).toBeInTheDocument()
        expect(screen.queryByTestId('schedule-create-button')).toHaveAttribute('disabled')
    })

    it('Should display error message because start date is blank', async () => {
        expect(await screen.findByTestId('modal-title')).toHaveTextContent('スケジュール作成(一日のみ)')
        userEvent.click(screen.queryByTestId('change-create-schedule-mode-button'))
        expect(await screen.findByTestId('modal-title')).toHaveTextContent('スケジュール作成(期間指定)')
        userEvent.clear(screen.queryByTestId('startDate-form'))
        userEvent.click(screen.getByTestId('modal-title'))
        expect(await screen.findByText('日付を選択してください。')).toBeInTheDocument()
        expect(screen.queryByTestId('schedule-create-button')).toHaveAttribute('disabled')
    })

    it('Should display error message because start date is past date', async () => {
        expect(await screen.findByTestId('modal-title')).toHaveTextContent('スケジュール作成(一日のみ)')
        userEvent.click(screen.queryByTestId('change-create-schedule-mode-button'))
        expect(await screen.findByTestId('modal-title')).toHaveTextContent('スケジュール作成(期間指定)')
        userEvent.clear(screen.queryByTestId('startDate-form'))
        userEvent.type(screen.queryByTestId('startDate-form'), moment(TODAY).add(-1, 'days').format('YYYY-MM-DD'))
        userEvent.click(screen.getByTestId('modal-title'))
        expect(await screen.findByText('過去の日付は選択できません。')).toBeInTheDocument()
        expect(screen.queryByTestId('schedule-create-button')).toHaveAttribute('disabled')
    })

    it('Should display error message because end date is blank', async () => {
        expect(await screen.findByTestId('modal-title')).toHaveTextContent('スケジュール作成(一日のみ)')
        userEvent.click(screen.queryByTestId('change-create-schedule-mode-button'))
        expect(await screen.findByTestId('modal-title')).toHaveTextContent('スケジュール作成(期間指定)')
        userEvent.clear(screen.queryByTestId('endDate-form'))
        userEvent.click(screen.getByTestId('modal-title'))
        expect(await screen.findByText('日付を選択してください。')).toBeInTheDocument()
        expect(screen.queryByTestId('schedule-create-button')).toHaveAttribute('disabled')
    })

    it('Should display error message because end date is past date', async () => {
        expect(await screen.findByTestId('modal-title')).toHaveTextContent('スケジュール作成(一日のみ)')
        userEvent.click(screen.queryByTestId('change-create-schedule-mode-button'))
        expect(await screen.findByTestId('modal-title')).toHaveTextContent('スケジュール作成(期間指定)')
        userEvent.clear(screen.queryByTestId('endDate-form'))
        userEvent.type(screen.queryByTestId('endDate-form'), moment(TODAY).add(-1, 'days').format('YYYY-MM-DD'))
        userEvent.click(screen.getByTestId('modal-title'))
        expect(await screen.findByText('過去の日付は選択できません。')).toBeInTheDocument()
        expect(screen.queryByTestId('schedule-create-button')).toHaveAttribute('disabled')
    })
})