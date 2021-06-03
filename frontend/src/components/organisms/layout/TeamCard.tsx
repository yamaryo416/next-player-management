import { memo, VFC } from "react"
import { Box, Stack, Text, WrapItem } from "@chakra-ui/layout"
import { useRouter } from "next/router"

import { Image } from "@chakra-ui/image"

type Props = {
    teamId: string;
    teamName: string;
    coachName: string;
    introduction: string;
    joinCount: number;
}

export const TeamCard: VFC<Props> = memo((props) => {
    const { teamId, teamName, coachName, introduction, joinCount } = props;

    const router = useRouter()

    return (
        <Box
            w="300px"
            p={4}
            ml={{ base: "20px", md: "0px"}}
            mr={{ base: "0px", md: "20px"}}
            mb="30px"
            borderColor="gray.600"
            bg="rgb(10, 10, 10)"
            borderStyle="solid"
            borderWidth="1px"
            display="block"
            fontSize={{ md: "16px"}}
            onClick={async () => {
                router.push(`/teams/${teamId}`)
        }}>
            <Stack spacing={10}>
                <Text textAlign="center" data-testId={`${teamId}-team-name`}>{teamName}</Text>
                <Box>
                    <Image
                        borderRadius="full"
                        boxSize="100px"
                        src='/images/team.jpg'
                        alt="チーム画像"
                        mx="auto"
                    />
                </Box>
                <Text data-testId={`${teamId}-team-coach`} >コーチ: {coachName}</Text>
                <Text data-testId={`${teamId}-team-join-count`}>チーム人数: {joinCount}人</Text>
                <Box>
                    <Text>紹介文:</Text>
                    <Text>{introduction ? introduction : "記載なし"}</Text>
                </Box>
            </Stack>
        </Box>
    )
})