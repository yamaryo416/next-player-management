import { memo, VFC } from "react";
import { Button } from "@chakra-ui/button";
import { Box, Flex, Link } from "@chakra-ui/layout";
import { useRouter } from "next/router"

import { useControllModal } from "../../../hooks/useControllModal";
import { useGetMyProfile } from "../../../hooks/queries/useGetMyProfile";
import { PageTitle } from "../../atoms/title/PageTitle";

type Props = {
    teamName: string | undefined;
}

export const TeamDetailMenubar: VFC<Props> = memo((props) => {
    const { teamName } = props;

    const router = useRouter()

    const { onOpenConfrimTeamJoinModal } = useControllModal()
    const { dataMyProfile } =useGetMyProfile()
    
    return (
        <Box w={{ base: "350px", md: "auto"}}>
            <PageTitle>{teamName}'s Page</PageTitle>
            <Flex justifyContent="space-between" alignItems="center" mb={10} zIndex="8">
                <Box ml={10}>
                    <Link fontSize={{ base: "10px", md: "16px" }} onClick={() => router.push("/teams")} color="orange">チーム一覧に戻る</Link>
                </Box>
                <Box>
                    {!dataMyProfile?.myProfile.teamBoard && (
                        <Button fontSize={{ base: "13px",  md: "16px" }} bg="rgb(255, 255, 0)" color="black" onClick={onOpenConfrimTeamJoinModal}>チームに加入する</Button>
                    )}
                </Box>
            </Flex>
        </Box>
    )
})