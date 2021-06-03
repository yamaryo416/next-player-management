import { memo, VFC } from "react";
import { Box, Flex, Heading } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/spinner";

import { MainMenubar } from "../../components/templates/MainMenubar";
import { HeaderForAuthUser } from "../../components/templates/HeaderForAuthUser";
import { useGetMyProfile } from "../../hooks/queries/useGetMyProfile";
import { ModalSection } from "../../components/templates/ModalSection";
import { useGetAllTeamBoard } from "../../hooks/queries/useGetAllTeamBoard";
import { TeamCard } from "../../components/organisms/layout/TeamCard";
import { PageTitle } from "../../components/atoms/title/PageTitle";
import { FailedText } from "../../components/atoms/text/FailedText";
import { CustomSpinner } from "../../components/atoms/spinner/CustomSpinner";

const TeamList: VFC = memo(() => {
    const { loadingMyProfile, errorMyProfile, dataMyProfile } = useGetMyProfile()
    const { loadingAllTeamBoard, dataAllTeamBoard, errorAllTeamBoard } = useGetAllTeamBoard()

    if (loadingMyProfile) return <Spinner />
    else if (errorMyProfile) return <FailedText />
    
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
                <Box mt="100px" color="white">
                    <PageTitle>Other Teams Page</PageTitle>
                    {!dataMyProfile?.myProfile.teamBoard && (
                        <Heading fontSize={{ base: "10px", md: "16px"}} pl={10} mb={10} >
                            チームに加入しましょう！
                        </Heading>
                    )}
                    <Flex flexWrap="wrap">
                        {loadingAllTeamBoard && <CustomSpinner />}
                        {errorAllTeamBoard && <FailedText />}
                        {dataAllTeamBoard?.allTeamBoard.edges?.map(({ node }) => (
                            <TeamCard
                                key={node.id}
                                teamId={node.team.id}
                                teamName={node.team.name}
                                coachName={node.coach}
                                introduction={node.introduction}
                                joinCount={node.joinCount}
                            />
                        ))}
                    </Flex>
                </Box>
            </Flex>
            <ModalSection
                isJoinTeam={dataMyProfile?.myProfile.teamBoard !== null}
                isCoach={dataMyProfile?.myProfile.isCoach!}
                page="teamListPage"
            />
        </>
    )
})

export default TeamList