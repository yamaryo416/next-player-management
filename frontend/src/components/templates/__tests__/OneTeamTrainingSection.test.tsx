import '@testing-library/jest-dom/extend-expect'

import { render, screen, cleanup } from '@testing-library/react'
import { RecoilRoot } from 'recoil';
import { MockedProvider } from '@apollo/client/testing' 

import { OneTeamTrainingSection } from '../OneTeamTrainingSection';
import { mockAbsentTrainings, mockTrainings } from '../../../mocks/mockTrainingData';

afterEach(cleanup)

describe('OneTeamTrainingSection', () => {
    it('Should render correct contents', () => {
        render(
            <MockedProvider>
                <RecoilRoot>
                    <OneTeamTrainingSection trainings={mockTrainings} />    
                </RecoilRoot>        
            </MockedProvider>
        )
        expect(screen.queryByText('Training List')).toBeInTheDocument()
        expect(screen.queryAllByRole('img')[0]).toHaveAttribute('src', "/icon/white-barbell.png")
        expect(screen.queryByTestId('1-training-title')).toHaveTextContent('トレーニング1')
        expect(screen.queryAllByRole('img')[9]).toHaveAttribute('src', '/icon/white-swim.png')
        expect(screen.queryByTestId('10-training-title')).toHaveTextContent('トレーニング10')
        expect(screen.queryAllByRole('img')[9]).toHaveAttribute('src', '/icon/white-swim.png')
        expect(screen.queryByTestId('11-training-title')).not.toBeInTheDocument()
    })

    it('Should render absent message', () => {
        render(
            <MockedProvider>
                <RecoilRoot>
                    <OneTeamTrainingSection trainings={mockAbsentTrainings} />
                </RecoilRoot>
            </MockedProvider>
        )
        expect(screen.queryByText('トレーニングはありません。')).toBeInTheDocument()
    })
})