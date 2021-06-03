import { memo, VFC } from "react"
import { Box, Flex, Heading, Stack, Text } from "@chakra-ui/layout"
import { Image } from "@chakra-ui/image"

import { SectionTitle } from "../atoms/title/SectionTitle"
import { SectionCard } from "../organisms/layout/SectionCard"
import { TeamBoardPost } from "../organisms/team/TeamBoardPost"


type Props = {
    teamName: string | undefined;
    introduction: string | undefined;
    coachName: String | undefined;
    joinCount: Number | undefined;
    isMyTeam: boolean;
}

export const TeamBoardSection: VFC<Props> = memo((props) => {
    const { teamName, introduction, coachName, joinCount, isMyTeam } = props;

    return (
        <SectionCard width="450px">
            <SectionTitle >{teamName ? teamName : null}'s Board</SectionTitle>
            <Box pb={10}>
                <Stack spacing={5}>
                    <Flex justify="center">
                        <Image
                            borderRadius="full"
                            boxSize="100px"
                            src='/images/team.jpg'
                            alt="チーム画像"
                        />
                    </Flex>
                    <Flex alignItems="center">
                        <Heading fontSize={{ base: "13px", md: "16px" }}>コーチ:</Heading>
                        <Text pl={4} data-testid='team-coach-name'>{coachName}</Text>
                    </Flex>
                    <Flex alignItems="cneter">
                        <Heading fontSize={{ base: "13px", md: "16px" }}>チーム人数:</Heading>
                        <Text pl={4} data-testid='team-join-count'>{joinCount}人</Text>
                    </Flex>
                    <Heading fontSize={{ base: "13px", md: "16px" }}>紹介文:</Heading>
                    <Text data-testid='team-introduction'>
                        {introduction === "" ? "記載はありません。" : introduction}
                    </Text>
                </Stack>
            </Box>
            {isMyTeam ? <TeamBoardPost /> : null }
        </SectionCard>
    )
})

