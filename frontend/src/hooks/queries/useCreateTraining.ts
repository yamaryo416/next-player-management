import { useCallback } from "react"
import { useMutation } from "@apollo/client"

import { CREATE_TRAINING, GET_MY_TEAM_TRAININGS } from "../../queries"
import { useMessage } from "../useMessage"
import { useControllModal } from "../useControllModal"

export const useCreateTraining = () => {
   const { onCloseTrainingCreateOrUpdateModal } = useControllModal()

    const { showMessage } = useMessage()

    const [createTrainingMutation] = useMutation(CREATE_TRAINING, {
        refetchQueries: [{ query: GET_MY_TEAM_TRAININGS }],
    })

    const createTraining = useCallback(async (
        title: string,
        count: number | undefined,
        load: number | undefined, 
        distance: number | undefined,
        description: string,
        iconNumber: number | undefined
        ) => {
        try {
            if (title === "") {
                throw "トレーニング名を入力してください。"
            }
            await createTrainingMutation({
                variables: { title, count, load, distance, description, iconNumber }
            })
            showMessage({ title: "トレーニングを作成しました。", status: "success" })
            onCloseTrainingCreateOrUpdateModal()
        } catch (err) {
            showMessage({ title: err, status: "error" })
        }
    }, [])

    return { createTraining }
}