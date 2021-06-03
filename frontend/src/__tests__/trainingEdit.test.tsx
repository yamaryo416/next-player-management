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
import { TrainingCreateOrUpdateModal } from '../components/organisms/modal/TrainingCreateOrUpdateModal';
import { mockCreateTrainingMutation, mockMyTeamTrainingsQuery, mockUpdateTrainingMutation } from '../mocks/mockTrainingData';
import { MyTeamTrainingSection } from '../components/templates/MyTeamTrainingSection';

const mocks = [
    mockMyProfileQuery(true, false),
    mockUpdateTrainingMutation,
    mockMyTeamTrainingsQuery
]

afterEach(cleanup)

describe('Training Edit', () => {
    describe('Success', () => {
        it('Sould display success message', async () => {
            render(
                <MockedProvider mocks={mocks}>
                    <RecoilRoot>
                        <MyTeamTrainingSection />
                        <TrainingCreateOrUpdateModal />
                    </RecoilRoot>
                </MockedProvider>
            )
            userEvent.click(await screen.findByTestId('1-training-edit-icon'))
            expect(await screen.findByTestId('modal-title')).toHaveTextContent('トレーニング編集')
            expect(screen.queryByTestId('title-form')).toHaveValue('トレーニング1')
            userEvent.clear(screen.getByTestId('title-form'))
            userEvent.type(screen.getByTestId('title-form'), 'トレーニング1 update')
            await new Promise(resolve => setTimeout(resolve, 1000));
            userEvent.click(screen.queryByTestId('training-create-button'))
            expect(await screen.findByText('トレーニングを編集しました。')).toBeInTheDocument()
        })
    })
})