import '@testing-library/jest-dom/extend-expect'

import { render, screen, cleanup } from '@testing-library/react'
import { RecoilRoot } from 'recoil';
import { MockedProvider } from '@apollo/client/testing' 

import { TeamBoardSection } from '../TeamBoardSection';

afterEach(cleanup)

describe('TeamBoardSection', () => {
    describe('My team', () => {
        it('Should render correct contents', () => {
            render(
                <MockedProvider>
                    <RecoilRoot>
                        <TeamBoardSection
                            teamName="team"
                            introduction='よろしくお願いします'
                            coachName='user'
                            joinCount={1}
                            isMyTeam={true}
                        />
                    </RecoilRoot>
                </MockedProvider>
            )
            expect(screen.queryByText("team's Board")).toBeInTheDocument()
            expect(screen.queryByTestId('team-coach-name')).toHaveTextContent('user')
            expect(screen.queryByTestId('team-join-count')).toHaveTextContent('1人')
            expect(screen.queryByTestId('team-introduction')).toHaveTextContent('よろしくお願いします')
            expect(screen.queryByText("Post's List")).toBeInTheDocument()
        })

        it('Should display introduction is absent as introduction null', () => {
            render(
                <MockedProvider>
                    <RecoilRoot>
                        <TeamBoardSection
                            teamName="team"
                            introduction=''
                            coachName='user'
                            joinCount={1}
                            isMyTeam={true}
                        />
                    </RecoilRoot>
                </MockedProvider>
            )
            expect(screen.queryByTestId('team-introduction')).toHaveTextContent('記載はありません。')
        })
    })

    describe('Other team', () => {
        it('Should render correct contents', () => {
            render(
                <MockedProvider>
                    <RecoilRoot>
                        <TeamBoardSection
                            teamName="team"
                            introduction='よろしくお願いします'
                            coachName='user'
                            joinCount={1}
                            isMyTeam={false}
                        />
                    </RecoilRoot>
                </MockedProvider>
            )
            expect(screen.queryByText("Post's List")).not.toBeInTheDocument()
        })
    })
})