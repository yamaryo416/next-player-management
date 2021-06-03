import { useCallback } from "react"
import { useMutation } from "@apollo/client"
import { useRouter } from "next/router"

import { DELETE_USER } from "../../queries"
import { useControllModal } from "../useControllModal"
import { useMessage } from "../useMessage"

export const useDeleteUser = () => {
    const [deleteUserMutation] = useMutation(DELETE_USER)
    const { showMessage } = useMessage()
    const { onCloseConfirmUserDeleteModal } = useControllModal()
    const router = useRouter()

    
    const deleteUser = useCallback(
        async () => {
            await deleteUserMutation({
                variables: { confirm: true }
            })
            localStorage.removeItem("token");
            onCloseConfirmUserDeleteModal()
            showMessage({ title: "ユーザーを削除しました。", status: "success" })
            router.push("/")
    }, [])

    return { deleteUser }
}