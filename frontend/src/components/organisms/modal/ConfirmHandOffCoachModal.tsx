import { memo, VFC } from "react";
import { Button } from "@chakra-ui/button";
import { Box, Heading, Stack, Text } from "@chakra-ui/layout";
import { useRecoilValue } from "recoil";

import { useUpdateTeamBoardCoach } from "../../../hooks/queries/useUpdateTeamBoardCoach";
import { useControllModal } from "../../../hooks/useControllModal";
import { confirmHandOffCoachModalState } from "../../../store/confirmHandOffCoachModalState";
import { ModalLayout } from "../layout/ModalLayout";
import { PrimaryButton } from "../../atoms/button/PrimaryButton";

export const ConfirmHandOffCoachModal: VFC = memo(() => {
    const { onCloseConfirmHandOffCoachModal } = useControllModal()
    const { updateTeamBoardCoach } = useUpdateTeamBoardCoach()

    const confirmHandOffCoachModal = useRecoilValue(confirmHandOffCoachModalState)

    return (
        <ModalLayout
            title=""
            isOpen={confirmHandOffCoachModal.isModalOpen}
            onClose={onCloseConfirmHandOffCoachModal}
        >
            <Heading as="h3" fontSize="20px">
                以下のユーザーにコーチ権限を委譲します。<br/>よろしいですか？
            </Heading>
            <Text data-testid='hand-off-coach-user-name'>ユーザー名: {confirmHandOffCoachModal.nickname}</Text>
            <Box textAlign="center">
                <PrimaryButton
                    name='hand-off-coach'
                    type='button'
                    disabled={false}
                    onClick={()=>{
                        updateTeamBoardCoach(confirmHandOffCoachModal.id)
                }}>
                    委譲する
                </PrimaryButton>
            </Box>
        </ModalLayout>

    )
})