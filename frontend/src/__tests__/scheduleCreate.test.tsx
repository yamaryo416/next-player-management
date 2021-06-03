import '@testing-library/jest-dom/extend-expect'

import { render, screen, cleanup } from '@testing-library/react'
import { RecoilRoot } from 'recoil';
import { MockedProvider } from '@apollo/client/testing' 
import userEvent from '@testing-library/user-event'
import moment from 'moment';

import { MainMenubar } from '../components/templates/MainMenubar';
import { mockMyTeamTrainingsQuery } from '../mocks/mockTrainingData';
import { ScheduleCreateModal } from '../components/organisms/modal/ScheduleCreateModal';
import { mockCreateManySchedulesMutation, mockCreateSingleScheduleMutation, mockMyTeamSchedulesQuery } from '../mocks/mockScheduleData';
import { TODAY } from '../../constants';

const mocks = [
    mockMyTeamTrainingsQuery,
    mockCreateSingleScheduleMutation,
    mockCreateManySchedulesMutation,
    mockMyTeamSchedulesQuery
]

afterEach(cleanup)

describe('Single Schedule Create', () => {
    describe('Success', () => {
        it('Sould display success message', async () => {
            render(
                <MockedProvider mocks={mocks} >
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
            expect(await screen.findByTestId('modal-title')).toHaveTextContent('スケジュール作成(一日のみ)')
            userEvent.selectOptions(await screen.findByTestId('training-form'), screen.queryByTestId('1-training'))
            await new Promise(resolve => setTimeout(resolve, 1000));
            userEvent.click(screen.getByTestId('schedule-create-button'))
            expect(await screen.findByText('スケジュールを作成しました。')).toBeInTheDocument()
        })
    })
})

describe('Many Schedule Create', () => {
    describe('Success', () => {
        it('Sould display success message', async () => {
            render(
                <MockedProvider mocks={mocks} >
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
            expect(await screen.findByTestId('modal-title')).toHaveTextContent('スケジュール作成(一日のみ)')
            userEvent.click(screen.getByTestId('change-create-schedule-mode-button'))
            expect(await screen.findByTestId('modal-title')).toHaveTextContent('スケジュール作成(期間指定)')
            expect(await screen.findByTestId('1-training')).toBeInTheDocument()
            userEvent.selectOptions(await screen.findByTestId('training-form'), screen.getByTestId('1-training'))
            userEvent.clear(await screen.findByTestId('endDate-form'))
            userEvent.type(screen.queryByTestId('endDate-form'), moment(TODAY).add(7, 'days').format('YYYY-MM-DD'))
            await new Promise(resolve => setTimeout(resolve, 1000));
            userEvent.click(screen.getByTestId('schedule-create-button'))
            await new Promise(resolve => setTimeout(resolve, 1000));
            expect(screen.queryAllByText('スケジュールを作成しました。')[0]).toBeInTheDocument()
        })
    })

    describe('False', () => {
        it('Sould display error message because start date or end date is not correct', async () => {
            render(
                <MockedProvider mocks={mocks} >
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
            expect(await screen.findByTestId('modal-title')).toHaveTextContent('スケジュール作成(一日のみ)')
            userEvent.click(screen.getByTestId('change-create-schedule-mode-button'))
            expect(await screen.findByTestId('modal-title')).toHaveTextContent('スケジュール作成(期間指定)')
            expect(await screen.findByTestId('1-training')).toBeInTheDocument()
            userEvent.selectOptions(await screen.findByTestId('training-form'), screen.getByTestId('1-training'))
            userEvent.clear(screen.queryByTestId('startDate-form'))
            userEvent.type(screen.queryByTestId('startDate-form'), moment(TODAY).add(7, 'days').format('YYYY-MM-DD'))
            userEvent.clear(screen.queryByTestId('endDate-form'))
            userEvent.type(screen.queryByTestId('endDate-form'), TODAY)
            await new Promise(resolve => setTimeout(resolve, 1000));
            userEvent.click(screen.getByTestId('schedule-create-button'))
            expect(await screen.findByText('期間を正しく入力してください。')).toBeInTheDocument()
        })
    })
})