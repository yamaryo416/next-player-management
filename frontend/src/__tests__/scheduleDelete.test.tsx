import '@testing-library/jest-dom/extend-expect'

import { render, screen, cleanup } from '@testing-library/react'
import { RecoilRoot } from 'recoil';
import { MockedProvider } from '@apollo/client/testing' 
import userEvent from '@testing-library/user-event'
import { mockMyProfileQuery } from '../mocks/mockProfileData';
import { MainMenubar } from '../components/templates/MainMenubar';
import { TeamEditModal } from '../components/organisms/modal/TeamEditModal';
import { mockUpdateTeamMutation } from '../mocks/mockTeamData';
import { mockUpdateTeamBoardIntroductionMutation } from '../mocks/mockTeamBoardData';
import { mockMyTeamTrainingsQuery } from '../mocks/mockTrainingData';
import { ScheduleCreateModal } from '../components/organisms/modal/ScheduleCreateModal';
import { mockCreateManySchedulesMutation, mockCreateSingleScheduleMutation, mockDeleteManySchedulesMutation, mockDeleteScheduleMutation, mockMyTeamSchedulesQuery, mockTodaySchedulesQuery } from '../mocks/mockScheduleData';
import moment from 'moment';
import { TODAY } from '../../constants';
import { MyTeamTrainingSection } from '../components/templates/MyTeamTrainingSection';
import { ConfirmScheduleDeleteModal } from '../components/organisms/modal/ConfirmScheduleDeleteModal';
import { MyTeamCalendarDetail } from '../components/organisms/calendar/MyTeamCalendarDetail';
import { ScheduleDeleteModal } from '../components/organisms/modal/ScheduleDeleteModal';


afterEach(cleanup)

const mocks = [
    mockMyProfileQuery(true, false),
    mockTodaySchedulesQuery,
    mockDeleteScheduleMutation,
    mockDeleteManySchedulesMutation,
    mockMyTeamSchedulesQuery
]

describe('Single Schedule Delete', () => {
    describe('Success', () => {
        it('Sould display success message', async () => {
            render(
                <MockedProvider mocks={mocks}>
                    <RecoilRoot>
                        <MyTeamCalendarDetail />
                        <ConfirmScheduleDeleteModal />
                    </RecoilRoot>
                </MockedProvider>
            )
            userEvent.click(await screen.findByTestId('1-schedule-delete-icon'))
            expect(await screen.findByTestId('delete-schedule-date')).toHaveTextContent(`日付: ${TODAY}`)
            expect(screen.queryByTestId('delete-schedule-title')).toHaveTextContent('トレーニング名: トレーニング1')
            userEvent.click(screen.queryByTestId('schedule-delete-button'))
            expect(await screen.findByText('スケジュールを削除しました。')).toBeInTheDocument()
        })
    })
})

describe('Many Schedule Delete', () => {
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
                        <ScheduleDeleteModal />
                        <ConfirmScheduleDeleteModal />
                    </RecoilRoot>
                </MockedProvider>
            )
            userEvent.click(screen.getByText('My Menu'))
            userEvent.click(screen.getByText('Delete Schedule'))
            expect(await screen.findByTestId('modal-title')).toHaveTextContent('スケジュール削除')
            userEvent.clear(await screen.findByTestId('endDate-form'))
            userEvent.type(screen.queryByTestId('endDate-form'), moment(TODAY).add(7, 'days').format('YYYY-MM-DD'))
            await new Promise(resolve => setTimeout(resolve, 1000));
            userEvent.click(screen.getByTestId('confirm-schedule-delete-button'))
            expect(await screen.findByTestId('delete-schedule-period')).toHaveTextContent(`${TODAY} ~ ${moment(TODAY).add(7, 'days').format('YYYY-MM-DD')}`)
            expect(screen.queryByTestId('delete-schedule-title')).toHaveTextContent('指定なし')
            userEvent.click(screen.getByTestId('schedule-delete-button'))
            await new Promise(resolve => setTimeout(resolve, 1000));
            expect(screen.queryAllByText('スケジュールを削除しました。')[0]).toBeInTheDocument()
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
                        <ScheduleDeleteModal />
                        <ConfirmScheduleDeleteModal />
                    </RecoilRoot>
                </MockedProvider>
            )
            userEvent.click(screen.getByText('My Menu'))
            userEvent.click(screen.getByText('Delete Schedule'))
            expect(await screen.findByTestId('modal-title')).toHaveTextContent('スケジュール削除')
            userEvent.clear(await screen.findByTestId('startDate-form'))
            userEvent.type(screen.queryByTestId('startDate-form'), moment(TODAY).add(7, 'days').format('YYYY-MM-DD'))
            await new Promise(resolve => setTimeout(resolve, 1000));
            userEvent.click(screen.getByTestId('confirm-schedule-delete-button'))
            expect(await screen.findByText('期間を正しく入力してください。')).toBeInTheDocument()
        })
    })
})