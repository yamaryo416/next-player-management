import { memo, VFC } from "react";
import { Button } from "@chakra-ui/button";
import { Box, Heading, Text } from "@chakra-ui/layout";

import { useTeamAuth } from "../../../hooks/queries/useTeamAuth";
import { useControllModal } from "../../../hooks/useControllModal";
import { ModalLayout } from "../layout/ModalLayout";
import { useRecoilValue } from "recoil";
import { confirmTeamJoinModalState } from "../../../store/confirmTeamJoinModalState";

type Props = {
    teamName: string | undefined;
    teamId: string | undefined;
}

export const ConfirmTeamJoinModal: VFC<Props> = memo((props) => {
    const { teamName, teamId } = props;

    const { onCloseConfrimTeamJoinModal } = useControllModal()
    const { joinTeam } = useTeamAuth()

    const confirmTeamJoinModal  = useRecoilValue(confirmTeamJoinModalState)

    return (
        <ModalLayout
            title="チームに参加"
            isOpen={confirmTeamJoinModal}
            onClose={onCloseConfrimTeamJoinModal}
        >
            {teamId ? (
                <>
                    <Heading as="h3" fontSize="20px">
                        以下のチームに加入します。よろしいですか？
                    </Heading>
                    <Text fontWeight="bold">チーム名: {teamName}</Text>
                    <Box textAlign="center">
                        <Button bg="blue.500" px={5} color="white"  onClick={() => {
                            joinTeam(teamId!)
                            onCloseConfrimTeamJoinModal()
                        }}>加入する</Button>
                    </Box>
                </>
            ):(
                <Heading
                    as="h3"
                    fontSize="20px"
                    color="red.600"
                >
                    チーム名もしくはパスワードが間違っています。
                </Heading>
            )}
        </ModalLayout>
    )
})