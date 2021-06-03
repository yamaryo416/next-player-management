import { Box, Flex, Text } from "@chakra-ui/layout";
import { memo, VFC } from "react";
import { useGetMyProfile } from "../../../hooks/queries/useGetMyProfile";

type Props = {
    isMyTeam: boolean;
}

export const TrainingTableHeader: VFC<Props> = memo((props) => {
    const { isMyTeam } = props;

    const { dataMyProfile } = useGetMyProfile()

    return (
        <Flex borderBottom="1px solid #718096">
            <Box w={{ base: "30px", md: "60px"}}></Box>
            <Text  w={{ base: "70px", md: "130px"}}>タイトル</Text>
            <Text w={{ base: "30px", md: "40px"}} >回</Text>
            <Text w={{ base: "30px", md: "40px"}}>kg</Text>
            <Text w={{ base: "40px", md: "55px"}}>km</Text>
            {isMyTeam && !dataMyProfile?.myProfile.isGuest && <Text>実施回数</Text> }
        </Flex>
    )
})