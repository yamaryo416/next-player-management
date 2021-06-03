import { memo, VFC } from 'react'
import { HeaderForAuthUser } from '../components/templates/HeaderForAuthUser'
import { Box, Flex } from '@chakra-ui/layout'

import { MainMenubar } from '../components/templates/MainMenubar'
import { MyTeamCalendarSection } from '../components/templates/MyTeamCalendarSection'
import { MyTeamTrainingSection } from '../components/templates/MyTeamTrainingSection'
import { TeamBoardSection } from '../components/templates/TeamBoardSection'
import { useGetMyProfile } from '../hooks/queries/useGetMyProfile'
import { ScheduleFinishedMemberSection } from '../components/templates/ScheduleFinishedMemberSection'
import { useRecoilValue } from 'recoil'
import { scheduleFinishedModalState } from '../store/scheduleFinishedModalState'
import { ModalSection } from '../components/templates/ModalSection'
import { PageTitle } from '../components/atoms/title/PageTitle'
import { FailedText } from '../components/atoms/text/FailedText'
import { CustomSpinner } from '../components/atoms/spinner/CustomSpinner'

const Main: VFC = memo(() => {
    const { loadingMyProfile, dataMyProfile, errorMyProfile } = useGetMyProfile()

    const scheduleFinishedModal = useRecoilValue(scheduleFinishedModalState)

    if (loadingMyProfile) return <CustomSpinner />
    else if (errorMyProfile) return <FailedText />

    return (
        <>
            <HeaderForAuthUser
                nickname={dataMyProfile?.myProfile?.nickname!}
                myTeamBoard={dataMyProfile?.myProfile.teamBoard}
                isMyTeamPage={true}
                isCoach={dataMyProfile?.myProfile.isCoach!}
                isGuest={dataMyProfile?.myProfile.isGuest!}
            />
            <Flex>
                <MainMenubar
                    isJoinTeam={dataMyProfile?.myProfile.teamBoard !== null}
                    isCoach={dataMyProfile?.myProfile.isCoach!}
                    isMyTeamPage={true}
                    isGuest={dataMyProfile?.myProfile.isGuest!}
                />
                <Box mt="100px">
                    <PageTitle>My Page</PageTitle>
                    <Flex flexWrap="wrap" >
                        <Box>
                            <MyTeamCalendarSection/>
                        </Box>
                        {dataMyProfile?.myProfile.isCoach && scheduleFinishedModal.isOpen && (
                            <Box display={{ base: "none", md: "block" }}>
                                <ScheduleFinishedMemberSection />
                            </Box>
                        )}
                         <Box>
                            <MyTeamTrainingSection/>
                        </Box>
                        <Box>
                            <TeamBoardSection
                                teamName={dataMyProfile?.myProfile.teamBoard.team.name}
                                introduction={dataMyProfile?.myProfile.teamBoard?.introduction}
                                coachName={dataMyProfile?.myProfile.teamBoard?.coach}
                                joinCount={dataMyProfile?.myProfile.teamBoard.joinCount}
                                isMyTeam={true}
                            />
                        </Box>
                    </Flex>
                </Box>
            </Flex>
            <ModalSection
                isJoinTeam={dataMyProfile?.myProfile.teamBoard !== null}
                isCoach={dataMyProfile?.myProfile.isCoach!}
                page="myPage"
            />
        </>
    )
})

export default Main
