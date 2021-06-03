import '@testing-library/jest-dom/extend-expect'

import { render, screen, cleanup } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing' 
import userEvent from '@testing-library/user-event'

import { MainMenubar } from '../MainMenubar';
import { RecoilRoot } from 'recoil';

afterEach(cleanup)

describe('MainMenubar', () => {
    describe('My page', () => {
        describe('As Coach', () => {
            it('Should render correct contents', () => {
                render(
                    <MockedProvider>
                        <RecoilRoot>
                            <MainMenubar
                                isJoinTeam={true}
                                isCoach={true}
                                isMyTeamPage={true}
                                isGuest={false}
                            />
                        </RecoilRoot>
                    </MockedProvider>
                )
                expect(screen.queryByText('My Menu')).toBeInTheDocument()
                expect(screen.queryByText('Move Pages')).toBeInTheDocument()
            })
    
            it('Should display my menu after click my menu', () => {
                render(
                    <MockedProvider>
                        <RecoilRoot>
                            <MainMenubar
                                isJoinTeam={true}
                                isCoach={true}
                                isMyTeamPage={true}
                                isGuest={false}
                            />
                        </RecoilRoot>
                    </MockedProvider>
                )
                userEvent.click(screen.getByText('My Menu'))
                expect(screen.queryByText('Profile Edit')).toBeInTheDocument()
                expect(screen.queryByText('MyTeam Edit')).toBeInTheDocument()
                expect(screen.queryByText('Create Training')).toBeInTheDocument()
                expect(screen.queryByText('Create Schedule')).toBeInTheDocument()
                expect(screen.queryByText('Logout')).toBeInTheDocument()
                expect(screen.queryByText('MyTeam Edit')).toBeInTheDocument()
                expect(screen.queryByText('Join Team')).not.toBeInTheDocument()
                expect(screen.queryByText('Create Team')).not.toBeInTheDocument()
                expect(screen.queryByText('Account Delete')).not.toBeInTheDocument()
            })

            it('Should display move page list after click move page', () => {
                render(
                    <MockedProvider>
                        <RecoilRoot>
                            <MainMenubar
                                isJoinTeam={true}
                                isCoach={true}
                                isMyTeamPage={true}
                                isGuest={false}
                            />
                        </RecoilRoot>
                    </MockedProvider>
                )
                userEvent.click(screen.getByText('Move Pages'))
                expect(screen.queryByText('My Page')).toBeInTheDocument()
                expect(screen.queryByText('My Team Member')).toBeInTheDocument()
                expect(screen.queryByText('Other Teams')).toBeInTheDocument()
            })
        })

        describe('As General', () => {
            it('Should display my menu after click my menu', () => {
                render(
                    <MockedProvider>
                        <RecoilRoot>
                            <MainMenubar
                                isJoinTeam={true}
                                isCoach={false}
                                isMyTeamPage={true}
                                isGuest={false}
                            />
                        </RecoilRoot>
                    </MockedProvider>
                )
                userEvent.click(screen.getByText('My Menu'))
                expect(screen.queryByText('Profile Edit')).toBeInTheDocument()
                expect(screen.queryByText('MyTeam Edit')).not.toBeInTheDocument()
                expect(screen.queryByText('Create Training')).not.toBeInTheDocument()
                expect(screen.queryByText('Create Schedule')).not.toBeInTheDocument()
                expect(screen.queryByText('Delete Schedule')).not.toBeInTheDocument()
                expect(screen.queryByText('Logout')).toBeInTheDocument()
                expect(screen.queryByText('Join Team')).not.toBeInTheDocument()
                expect(screen.queryByText('Create Team')).not.toBeInTheDocument()
                expect(screen.queryByText('Account Delete')).not.toBeInTheDocument()
            })
    
            it('Should display move page list after click move page', () => {
                render(
                    <MockedProvider>
                        <RecoilRoot>
                            <MainMenubar
                                isJoinTeam={true}
                                isCoach={false}
                                isMyTeamPage={true}
                                isGuest={false}
                            />
                        </RecoilRoot>
                    </MockedProvider>
                )
                userEvent.click(screen.getByText('Move Pages'))
                expect(screen.queryByText('My Page')).toBeInTheDocument()
                expect(screen.queryByText('My Team Member')).not.toBeInTheDocument()
                expect(screen.queryByText('Other Teams')).toBeInTheDocument()
            })
        })

        describe('As Guest', () => {
            it('Should display my menu after click my menu', () => {
                render(
                    <MockedProvider>
                        <RecoilRoot>
                            <MainMenubar
                                isJoinTeam={true}
                                isCoach={false}
                                isMyTeamPage={true}
                                isGuest={true}
                            />
                        </RecoilRoot>
                    </MockedProvider>
                )
                userEvent.click(screen.getByText('My Menu'))
                expect(screen.queryByText('Profile Edit')).not.toBeInTheDocument()
                expect(screen.queryByText('MyTeam Edit')).not.toBeInTheDocument()
                expect(screen.queryByText('Create Training')).not.toBeInTheDocument()
                expect(screen.queryByText('Create Schedule')).not.toBeInTheDocument()
                expect(screen.queryByText('Delete Schedule')).not.toBeInTheDocument()
                expect(screen.queryByText('Join Team')).not.toBeInTheDocument()
                expect(screen.queryByText('Create Team')).not.toBeInTheDocument()
                expect(screen.queryByText('Account Delete')).toBeInTheDocument()
            })
    
            it('Should display move page list after click move page', () => {
                render(
                    <MockedProvider>
                        <RecoilRoot>
                            <MainMenubar
                                isJoinTeam={true}
                                isCoach={false}
                                isMyTeamPage={true}
                                isGuest={true}
                            />
                        </RecoilRoot>
                    </MockedProvider>
                )
                userEvent.click(screen.getByText('Move Pages'))
                expect(screen.queryByText('My Page')).toBeInTheDocument()
                expect(screen.queryByText('My Team Member')).not.toBeInTheDocument()
                expect(screen.queryByText('Other Teams')).toBeInTheDocument()
            })
        })
    })

    describe('Other Page', () => {
        describe('As Coach', () => {
            it('Should display my menu after click my menu', () => {
                render(
                    <MockedProvider>
                        <RecoilRoot>
                            <MainMenubar
                                isJoinTeam={true}
                                isCoach={true}
                                isMyTeamPage={false}
                                isGuest={false}
                            />
                        </RecoilRoot>
                    </MockedProvider>
                )
                userEvent.click(screen.getByText('My Menu'))
                expect(screen.queryByText('Profile Edit')).toBeInTheDocument()
                expect(screen.queryByText('MyTeam Edit')).not.toBeInTheDocument()
                expect(screen.queryByText('Create Training')).not.toBeInTheDocument()
                expect(screen.queryByText('Create Schedule')).not.toBeInTheDocument()
                expect(screen.queryByText('Delete Schedule')).not.toBeInTheDocument()
                expect(screen.queryByText('Logout')).toBeInTheDocument()
                expect(screen.queryByText('Join Team')).not.toBeInTheDocument()
                expect(screen.queryByText('Create Team')).not.toBeInTheDocument()
                expect(screen.queryByText('Account Delete')).not.toBeInTheDocument()
            })
        })

        describe('As not join team', () => {
            it('Should display my menu after click my menu', () => {
                render(
                    <MockedProvider>
                        <RecoilRoot>
                            <MainMenubar
                                isJoinTeam={false}
                                isCoach={false}
                                isMyTeamPage={false}
                                isGuest={false}
                            />
                        </RecoilRoot>
                    </MockedProvider>
                )
                userEvent.click(screen.getByText('My Menu'))
                expect(screen.queryByText('Profile Edit')).toBeInTheDocument()
                expect(screen.queryByText('MyTeam Edit')).not.toBeInTheDocument()
                expect(screen.queryByText('Create Training')).not.toBeInTheDocument()
                expect(screen.queryByText('Create Schedule')).not.toBeInTheDocument()
                expect(screen.queryByText('Delete Schedule')).not.toBeInTheDocument()
                expect(screen.queryByText('Logout')).toBeInTheDocument()
                expect(screen.queryByText('Join Team')).toBeInTheDocument()
                expect(screen.queryByText('Create Team')).toBeInTheDocument()
                expect(screen.queryByText('Account Delete')).not.toBeInTheDocument()
            })
        })
    })
})