import '@testing-library/jest-dom/extend-expect'

import { render, screen, cleanup } from '@testing-library/react'
import { RecoilRoot } from 'recoil';
import { MockedProvider } from '@apollo/client/testing'
import userEvent from '@testing-library/user-event';

import { mockMyProfileQuery } from '../../../mocks/mockProfileData';
import { mockErrorMyTeamTrainingQuery, mockMyTeamTrainingsQuery } from '../../../mocks/mockTrainingData';
import { MyTeamTrainingSection } from '../MyTeamTrainingSection';

const mocks = [
    mockMyProfileQuery(true, false),
    mockMyTeamTrainingsQuery
]

const mocksError= [
    mockMyProfileQuery(true, false),
    mockErrorMyTeamTrainingQuery
]

afterEach(cleanup)

describe('MyTeamTrainingSection', () => {
    it('Should render without error', () => {
        render(
            <MockedProvider mocks={mocks}>
                <RecoilRoot>
                    <MyTeamTrainingSection />
                </RecoilRoot>
            </MockedProvider>
        )
        expect(screen.queryAllByText('Loading...')[0]).toBeInTheDocument()
    })

    it('Should render correct contents', async () => {
        render(
            <MockedProvider mocks={mocks}>
                <RecoilRoot>
                    <MyTeamTrainingSection />
                </RecoilRoot>
            </MockedProvider>
        )
        await new Promise(resolve => setTimeout(resolve, 0));
        expect(screen.queryByText('Training List')).toBeInTheDocument()
        expect(screen.queryAllByRole('img')[0]).toHaveAttribute('src', "/icon/white-barbell.png")
        expect(screen.queryByTestId('1-training-title')).toHaveTextContent('トレーニング1')
        expect(screen.queryAllByRole('img')[9]).toHaveAttribute('src', '/icon/white-swim.png')
        expect(screen.queryByTestId('10-training-title')).toHaveTextContent('トレーニング10')
        expect(screen.queryAllByRole('img')[9]).toHaveAttribute('src', '/icon/white-swim.png')
        expect(screen.queryByTestId('11-training-title')).not.toBeInTheDocument()
        expect(screen.queryByText('全て表示')).toBeInTheDocument()
        expect(screen.queryByText('閉じる')).not.toBeInTheDocument()
    })

    it('Should display all trainings after click all display button', async () => {
        render(
            <MockedProvider mocks={mocks}>
                <RecoilRoot>
                    <MyTeamTrainingSection />
                </RecoilRoot>
            </MockedProvider>
        )
        await new Promise(resolve => setTimeout(resolve, 0));
        userEvent.click(screen.getByText('全て表示'))
        expect(screen.queryByTestId('11-training-title')).toBeInTheDocument()
        expect(screen.queryAllByRole('img')[10]).toHaveAttribute('src', '/icon/white-cycling.png')
        expect(screen.queryByText('全て表示')).not.toBeInTheDocument()
        expect(screen.queryByText('閉じる')).toBeInTheDocument()
        userEvent.click(screen.getByText('閉じる'))
        expect(screen.queryByTestId('11-training-title')).not.toBeInTheDocument()
        expect(screen.queryByText('全て表示')).toBeInTheDocument()
        expect(screen.queryByText('閉じる')).not.toBeInTheDocument()
    })

    it('Should render error message', async () => {
        render(
            <MockedProvider mocks={mocksError}>
                <RecoilRoot>
                    <MyTeamTrainingSection />
                </RecoilRoot>
            </MockedProvider>
        )
        await new Promise(resolve => setTimeout(resolve, 0));
        expect(screen.getByText('データの取得に失敗しました。')).toBeInTheDocument()
    })
})