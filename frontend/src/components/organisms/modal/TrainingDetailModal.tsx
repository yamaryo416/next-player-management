import { memo, VFC } from "react";
import { Heading, Text } from "@chakra-ui/layout";

import { useControllModal } from "../../../hooks/useControllModal";
import { useTrainingState } from "../../../hooks/useTrainingState";
import { ModalLayout } from "../layout/ModalLayout";
import { useRecoilValue } from "recoil";
import { trainingDetailModalState } from "../../../store/trainingDetailModalState";

export const TrainingDetailModal: VFC = memo(() => {

    const { onCloseTrainingDetailModal } = useControllModal()

    const trainingDetailModal = useRecoilValue(trainingDetailModalState)

    const { title, count, load, distance, description, isOpen } = trainingDetailModal

    return (
        <ModalLayout
            title=""
            isOpen={isOpen}
            onClose={() => {
                onCloseTrainingDetailModal()
        }}>
            <Heading fontSize="20px" textAlign="center">{title}</Heading>
            {count !== undefined && (
                <Text>回数: {count} 回</Text>
            )}
            {load !== undefined && (
                <Text>負荷: {load} kg</Text>
            )}
            {distance !== undefined && (
                <Text>距離: {distance}</Text>
            )}
            {description !== "" && (
                <Text>説明: {description}</Text>
            )} 
            
        </ModalLayout>
    )
})