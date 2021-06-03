import { useRecoilValue } from "recoil";
import { Box, Heading, Text } from "@chakra-ui/layout";
import { memo, VFC } from "react";

import { useDeletePost } from "../../../hooks/queries/useDeletePost";
import { useControllModal } from "../../../hooks/useControllModal";
import { confirmPostDeleteModalState } from "../../../store/confirmPostDeleteModalState";
import { DeleteButton } from "../../atoms/button/DeleteButton";
import { ModalLayout } from "../layout/ModalLayout";

export const ConfirmPostDeleteModal: VFC = memo(() => {
    const { deletePost } = useDeletePost()
    const { onCloseConfirmPostDeleteModal } = useControllModal()

    const confirmPostDeleteModal = useRecoilValue(confirmPostDeleteModalState)

    return (
        <ModalLayout
            title=""
            isOpen={confirmPostDeleteModal.isModalOpen}
            onClose={onCloseConfirmPostDeleteModal}
        >
            <Heading as="h3" fontSize="20px">
                以下の投稿を削除します。<br/>よろしいですか?
            </Heading>
            <Text data-testid='delete-post-text'>投稿内容: {confirmPostDeleteModal.text}</Text>
            <Box textAlign="center">
                <DeleteButton
                    name='delete-post'
                    type='button'
                    disabled={false}
                    onClick={() => deletePost(confirmPostDeleteModal.id)}
                >
                    削除
                </DeleteButton>
            </Box>
        </ModalLayout>
    )
})