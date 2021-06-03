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
import { mockDeleteTrainingMutation, mockMyTeamTrainingsQuery } from '../mocks/mockTrainingData';
import { ScheduleCreateModal } from '../components/organisms/modal/ScheduleCreateModal';
import { mockCreateManySchedulesMutation, mockCreateSingleScheduleMutation, mockMyTeamSchedulesQuery } from '../mocks/mockScheduleData';
import moment from 'moment';
import { TODAY } from '../../constants';
import { MyTeamTrainingSection } from '../components/templates/MyTeamTrainingSection';
import { ConfirmScheduleDeleteModal } from '../components/organisms/modal/ConfirmScheduleDeleteModal';
import { ConfirmTrainingDeleteModal } from '../components/organisms/modal/ConfirmTrainingDeleteModal';

afterEach(cleanup)

const mocks = [
    mockMyProfileQuery(true, false),
    mockMyTeamTrainingsQuery,
    mockDeleteTrainingMutation
]

describe('Training Delete', () => {
    describe('Success', () => {
        it('Sould display success message', async () => {
            render(
                <MockedProvider mocks={mocks}>
                    <RecoilRoot>
                        <MyTeamTrainingSection />
                        <ConfirmTrainingDeleteModal />
                    </RecoilRoot>
                </MockedProvider>
            )
            userEvent.click(await screen.findByTestId('1-training-delete-icon'))
            expect(await screen.findByTestId('delete-training-title')).toHaveTextContent('トレーニング名: トレーニング1')
            expect(await screen.findByTestId('delete-training-count')).toHaveTextContent('回数: 10 回')
            expect(await screen.findByTestId('delete-training-load')).toHaveTextContent('負荷: 20 kg')
            expect(await screen.findByTestId('delete-training-distance')).toHaveTextContent('距離: 30 km')
            userEvent.click(screen.queryByTestId('training-delete-button'))
            expect(await screen.findByText('トレーニングを削除しました。')).toBeInTheDocument()
        })
    })
})