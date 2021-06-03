import { memo, VFC } from "react";
import { Box, Heading, Stack, Text } from "@chakra-ui/layout";
import { useRecoilValue } from "recoil";

import { useDeleteMyProfileTeamBoard } from "../../../hooks/queries/useDeleteMyProfileTeamBoard";
import { useDeleteOneProfileTeamBoard } from "../../../hooks/queries/useDeleteOneProfileTeamBoard";
import { useControllModal } from "../../../hooks/useControllModal";
import { confirmTeamLeaveModalState } from "../../../store/confirmTeamLeaveModalState";
import { DeleteButton } from "../../atoms/button/DeleteButton";
import { ModalLayout } from "../layout/ModalLayout";

export const ConfirmTeamLeaveModal: VFC = memo(() => {
    const { onCloseConfirmTeamLeaveModal } = useControllModal()
    const { deleteMyProfileTeamBoard } = useDeleteMyProfileTeamBoard()
    const { deleteOneProfileTeamBoard } = useDeleteOneProfileTeamBoard()

    const confirmTeamLeaveModal = useRecoilValue(confirmTeamLeaveModalState)

    return (
        <ModalLayout
            title=""
            isOpen={confirmTeamLeaveModal.isModalOpen}
            onClose={onCloseConfirmTeamLeaveModal}
        >
            {confirmTeamLeaveModal.isMyself ? (
                <Heading as="h3" fontSize="20px">
                    チームを脱退します。<br/>よろしいですか?
                </Heading>
            ):(
                <>
                    <Heading as="h3" fontSize="20px">
                        以下のユーザーをチームから脱退させます。<br/>よろしいですか?
                    </Heading>
                    <Text data-testid='team-leave-user-name'>
                        ニックネーム: {confirmTeamLeaveModal.nickname}
                    </Text>
                </>
            )}
            <Box textAlign="center">
                <DeleteButton
                    name='team-leave'
                    type='button'
                    disabled={false}
                    onClick={() => confirmTeamLeaveModal.isMyself ? deleteMyProfileTeamBoard() : deleteOneProfileTeamBoard(confirmTeamLeaveModal.id) }
                >
                    {confirmTeamLeaveModal.isMyself ? "脱退する" : "脱退させる"}
                </DeleteButton>
            </Box>
        </ModalLayout>
    )
})