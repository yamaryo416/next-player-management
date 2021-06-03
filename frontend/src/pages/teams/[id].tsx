import { memo, VFC } from "react";
import { useQuery } from "@apollo/client";
import { Box, Flex } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/spinner";
import { useRouter } from 'next/router';

import { useGetMyProfile } from "../../hooks/queries/useGetMyProfile";
import { GET_ONE_TEAM_FROM_ID } from "../../queries";
import { OneTeamFromIdType } from "../../../types/queriesType";
import { MainMenubar } from "../../components/templates/MainMenubar";
import { ConfirmTeamJoinModal } from "../../components/organisms/modal/ConfirmTeamJoinModal";
import { TeamDetailMenubar } from "../../components/organisms/team/TeamDetailMenubar";
import { HeaderForAuthUser } from "../../components/templates/HeaderForAuthUser";
import { OneTeamCalendarSection } from "../../components/templates/OneTeamCalendarSection";
import { OneTeamTrainingSection } from "../../components/templates/OneTeamTrainingSection";
import { TeamBoardSection } from "../../components/templates/TeamBoardSection";
import { ModalSection } from "../../components/templates/ModalSection";

const TeamDetail: VFC = memo(() => {
    const router = useRouter()
    const { id } = router.query

    const { loadingMyProfile, dataMyProfile } = useGetMyProfile()
    const {loading: loadingOneTeamFromId, data: dataOneTeamFromId } = useQuery<OneTeamFromIdType>(GET_ONE_TEAM_FROM_ID, {
        variables: { teamId: id }
    })

    if (loadingMyProfile || loadingOneTeamFromId) return <Spinner />

    return (
        <>
            <HeaderForAuthUser
                nickname={dataMyProfile?.myProfile.nickname!}
                myTeamBoard={dataMyProfile?.myProfile.teamBoard}
                isMyTeamPage={false}
                isCoach={dataMyProfile?.myProfile.isCoach!}
                isGuest={dataMyProfile?.myProfile.isGuest!}
            />
            <Flex>
                <MainMenubar
                    isJoinTeam={dataMyProfile?.myProfile.teamBoard !== null}
                    isCoach={dataMyProfile?.myProfile.isCoach!}
                    isMyTeamPage={false}
                    isGuest={dataMyProfile?.myProfile.isGuest!}
                />
                {console.log(dataOneTeamFromId)}
                <Box mt="100px">
                   <TeamDetailMenubar teamName={dataOneTeamFromId?.oneTeamFromId.name} />
                    <Flex flexWrap="wrap">
                        <Box>
                            <OneTeamCalendarSection schedules={dataOneTeamFromId?.oneTeamFromId.teamBoard.schedules} />
                        </Box>
                        <Box>
                            <OneTeamTrainingSection trainings={dataOneTeamFromId?.oneTeamFromId.teamBoard.trainings} />
                        </Box>
                        <Box>
                            <TeamBoardSection
                                teamName={dataOneTeamFromId?.oneTeamFromId.name}
                                introduction={dataOneTeamFromId?.oneTeamFromId.teamBoard.introduction}
                                coachName={dataOneTeamFromId?.oneTeamFromId.teamBoard.coach}
                                joinCount={dataOneTeamFromId?.oneTeamFromId.teamBoard.joinCount}
                                isMyTeam={false}
                            />
                        </Box>
                    </Flex>
                </Box>
            </Flex>
            <ModalSection
                isJoinTeam={dataMyProfile?.myProfile.teamBoard !== null}
                isCoach={dataMyProfile?.myProfile.isCoach!}
                page="teamListPage"
            />
            <ConfirmTeamJoinModal teamName={dataOneTeamFromId?.oneTeamFromId.name} teamId={dataOneTeamFromId?.oneTeamFromId.teamBoard.id} /> 
        </>
    )
})

export default TeamDetail