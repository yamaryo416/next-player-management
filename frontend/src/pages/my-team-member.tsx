import { memo, VFC } from "react";
import { Box, Flex } from "@chakra-ui/layout";

import { useGetMyProfile } from "../hooks/queries/useGetMyProfile";
import { PageTitle } from "../components/atoms/title/PageTitle";
import { MainMenubar } from "../components/templates/MainMenubar";
import { HeaderForAuthUser } from "../components/templates/HeaderForAuthUser";
import { ModalSection } from "../components/templates/ModalSection";
import { MyTeamMemberDetailSection } from "../components/templates/MyTeamMemberDetailSection";
import { MyTeamMemberListSection } from "../components/templates/MyTeamMemberListSection";
import { FailedText } from "../components/atoms/text/FailedText";
import { CustomSpinner } from "../components/atoms/spinner/CustomSpinner";

const MyTeamMember: VFC = memo(() => {
    const { loadingMyProfile, dataMyProfile, errorMyProfile } = useGetMyProfile()
    
    if (loadingMyProfile) return <CustomSpinner />
    else if (errorMyProfile) return <FailedText />
    
    return (
        <>
            <HeaderForAuthUser
                nickname={dataMyProfile?.myProfile.nickname!}
                myTeamBoard={dataMyProfile?.myProfile.teamBoard}
                isMyTeamPage={true}
                isCoach={true}
                isGuest={false}
            />
            <Flex>
                <MainMenubar isJoinTeam={true} isCoach={true} isMyTeamPage={true} isGuest={false} />
                <Box mt="100px" >
                    <PageTitle>My Team Member Page</PageTitle>
                    <Flex flexWrap="wrap">
                        <Box>
                            <MyTeamMemberListSection />
                        </Box>
                        <Box display={{ base: "none", md: "block" }}>
                            <MyTeamMemberDetailSection />
                        </Box>
                    </Flex>
                </Box>
            </Flex>
            <ModalSection
                isJoinTeam={dataMyProfile?.myProfile.teamBoard !== null}
                isCoach={dataMyProfile?.myProfile.isCoach!}
                page="myTeamMemberPage"
            />
        </>
    )
})

export default MyTeamMember