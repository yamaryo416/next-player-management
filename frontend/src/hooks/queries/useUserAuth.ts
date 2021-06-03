import { useCallback } from "react"
import { useMutation } from "@apollo/client"
import { useRouter } from "next/router"

import { WORDS } from "../../../constants"
import { CREATE_GUEST_USER, CREATE_GENERAL_USER, GET_TOKEN } from "../../queries"
import { useControllModal } from "../useControllModal"
import { useMessage } from "../useMessage"

type UserVars = {
    nickname: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export const useUserAuth = () => {
    const router = useRouter()
    const { showMessage } = useMessage()
    const [getTokenMutation] = useMutation(GET_TOKEN)
    const [createGeneralUserMutation] = useMutation(CREATE_GENERAL_USER)
    const [createGuestUserMutation] = useMutation(CREATE_GUEST_USER)
    const { onCloseUserAuthModal, onOpenTeamAuthModal } = useControllModal()

    const passwordValidation = useCallback((password: string, password_confirmation: string) => {
        if (password !== password_confirmation) {
            throw new Error("パスワードが一致しません。")
        }
    }, [])

    const signup = useCallback(async (values: UserVars) => {
        const {nickname, email, password, password_confirmation} = values
        try {
            passwordValidation(password, password_confirmation)
            await createGeneralUserMutation({
                variables: {nickname, email, password},
            })
            const result =  await getTokenMutation({
                variables: {email, password}
            })
            localStorage.setItem("token", result.data.tokenAuth.token)
            showMessage({ title: "ユーザーを作成しました。", status: "success" })
            onCloseUserAuthModal()
            onOpenTeamAuthModal(true)
            router.push("/teams")
        } catch(err) {
            if (err.message.includes("duplicate")) {
                showMessage({ title: "Eメールは既に使われています。", status: "error" })
            } else {
                showMessage({ title: err.message, status: "error" })
            }
        }
    }, [])

    const login =  useCallback(async (email: string, password: string) => {
        try {
            const result =  await getTokenMutation({
                variables: {email, password}
            })
            localStorage.setItem("token", result.data.tokenAuth.token)
            showMessage({ title: "ログインしました。", status: "success" })
            onCloseUserAuthModal()
            router.push("/main")
        } catch(err) {
            if (err.message.includes("credentials")) {
                showMessage({ title: "Eメール、もしくはパスワードが間違っています。", status: "error" })
            }
        }
    }, [])

    const joinGuestUser = useCallback(async () => {
        let password = ""
        while (password.length <= 8) {
            password += WORDS[Math.floor(Math.random() * WORDS.length)]
        }
        const user = await createGuestUserMutation({
            variables: { password },
        })
        const result = await getTokenMutation({
            variables: { email: user.data.createGuestUser.user.email, password}
        })
        localStorage.setItem("token", result.data.tokenAuth.token)
        showMessage({ title: "ゲストとしてログインしました。", status: "success" })
        router.push("/teams")
    }, [])

    const logout =  useCallback(() => {
        localStorage.removeItem("token");
        router.push("/")
        showMessage({ title: "ログアウトしました。", status: "success" })
    }, [])


    return { signup, login, joinGuestUser, logout }
}