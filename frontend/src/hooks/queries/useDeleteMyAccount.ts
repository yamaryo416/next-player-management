import { useCallback } from "react"
import { useMutation } from "@apollo/client"
import { useRouter } from "next/router"

import { DELETE_USER } from "../../queries"
import { useMessage } from "../useMessage"

export const useDeleteMyAccount = () => {
    const [deleteUserMutation] = useMutation(DELETE_USER)

    const { showMessage } = useMessage()

    const router = useRouter()
    
    const deleteUser = useCallback(
        async () => {
            await deleteUserMutation({
                variables: { confirm: true }
            })
            localStorage.removeItem("token");
            router.push("/")
            showMessage({ title: "ユーザーを削除しました。", status: "success" })
    }, [])
    
    return { deleteUser }
}