import { useCallback } from "react"
import { useMutation } from "@apollo/client"

import { DELETE_POST, GET_MORE_MY_TEAM_POSTS } from "../../queries"
import { useControllModal } from "../useControllModal"
import { useMessage } from "../useMessage"
import { NUM_PAGE } from "../../../constants"

export const useDeletePost = () => {
    const { onCloseConfirmPostDeleteModal } = useControllModal()

    const [deletePostMutation] = useMutation(DELETE_POST, {
        refetchQueries: [{ query: GET_MORE_MY_TEAM_POSTS, variables: { first: NUM_PAGE } }]
    })

    const { showMessage } = useMessage()

    const deletePost = useCallback(
        async (postId: string) => {
            await deletePostMutation({
                variables: { postId }
            })
            onCloseConfirmPostDeleteModal()
            showMessage({ title: "投稿を削除しました。", status: "success" })
    } ,[])

    return { deletePost }
}