import { memo, VFC } from "react";
import { Box, Heading, Text } from "@chakra-ui/layout";
import { useRecoilValue } from "recoil";

import { useDeleteTraining } from "../../../hooks/queries/useDeleteTraining";
import { useControllModal } from "../../../hooks/useControllModal";
import { useTrainingState } from "../../../hooks/useTrainingState";
import { confirmTrainingDeleteState } from "../../../store/confirmtTrainingDeleteModalState";
import { DeleteButton } from "../../atoms/button/DeleteButton";
import { ModalLayout } from "../layout/ModalLayout";

export const ConfirmTrainingDeleteModal: VFC = memo(() => {
    const { onCloseConfirmTrainingDeleteModal } = useControllModal()
    const { deleteTraining } = useDeleteTraining()

    const confirmTrainingDeleteModal = useRecoilValue(confirmTrainingDeleteState)

    const { id, title, count, load, distance, description, isOpen } = confirmTrainingDeleteModal

    return (
        <ModalLayout
            title=""
            isOpen={isOpen}
            onClose={onCloseConfirmTrainingDeleteModal}
        >
            <Heading as="h3" fontSize="20px">以下のトレーニングを削除します。<br/>よろしいですか？</Heading>
            <Text data-testid='delete-training-title'>トレーニング名: {title}</Text>
            {count !== undefined && (
                <Text data-testid='delete-training-count'>回数: {count} 回</Text>
            )}
            {load !== undefined && (
                <Text data-testid='delete-training-load'>負荷: {load} kg</Text>
            )}
            {distance !== undefined && (
                <Text data-testid='delete-training-distance'>距離: {distance} km</Text>
            )}
            {description !== "" && (
                <Text ata-testid='delete-training-description'>説明: {description}</Text>
            )} 
                <Box textAlign="center">
                <DeleteButton 
                    name='training-delete'
                    type='button'
                    disabled={false}
                    onClick={() => {
                        deleteTraining(id)
                        onCloseConfirmTrainingDeleteModal()
                    }}
                >
                    削除
                </DeleteButton>
            </Box>
        </ModalLayout>
    )
})