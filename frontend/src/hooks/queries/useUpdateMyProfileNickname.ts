import { useCallback } from "react"
import { useMutation } from "@apollo/client"

import { GET_MY_PROFILE, UPDATE_MY_PROFILE_NICKNAME } from "../../queries"
import { useControllModal } from "../useControllModal"
import { useMessage } from "../useMessage"

export const useUpdateMyProfileNickname = () => {
    const [updateMyProfileNicknameMutation] = useMutation(UPDATE_MY_PROFILE_NICKNAME, {
        refetchQueries: [{ query: GET_MY_PROFILE }]
    })
    const { showMessage } = useMessage()
    const { onCloseMyProfileEditModal } = useControllModal()

    const updateMyProfileNickname = useCallback(
        async (nickname: string) =>{
            try {
                await updateMyProfileNicknameMutation({
                    variables: { nickname }
                })
                showMessage({ title: "プロフィールを編集しました。", status: "success" })
                onCloseMyProfileEditModal()
            } catch (err) {
                console.log(err)
            }
    }, [])

    return { updateMyProfileNickname }
}