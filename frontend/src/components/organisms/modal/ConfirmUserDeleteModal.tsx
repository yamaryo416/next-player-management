import { memo, VFC } from "react";
import { Box, Heading } from "@chakra-ui/layout";
import { useRecoilValue } from "recoil";

import { useDeleteUser } from "../../../hooks/queries/useDeleteUser";
import { useControllModal } from "../../../hooks/useControllModal";
import { confirmUserDeleteModalState } from "../../../store/confirmUserDeleteModalState";
import { DeleteButton } from "../../atoms/button/DeleteButton";
import { ModalLayout } from "../layout/ModalLayout";

export const ConfirmUserDeleteModal: VFC = memo(() => {
    const { onCloseConfirmUserDeleteModal } = useControllModal()
    const { deleteUser } = useDeleteUser()
    
    const confirmUserDeleteModal = useRecoilValue(confirmUserDeleteModalState)

    return (
        <ModalLayout
            title=""
            isOpen={confirmUserDeleteModal}
            onClose={onCloseConfirmUserDeleteModal}
        >
            <Heading  as="h3" fontSize="20px" mb={3}>
                アカウントを削除します。<br/>よろしいですか?
            </Heading>
            <Box textAlign="center">
                <DeleteButton
                    name='user-delete'
                    onClick={deleteUser}
                >
                    削除
                </DeleteButton>
            </Box>
        </ModalLayout>
    )
})