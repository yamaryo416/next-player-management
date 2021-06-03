import { useMutation } from "@apollo/client"
import { useLazyQuery } from "@apollo/react-hooks"
import { useRouter } from "next/router"

import { CREATE_TEAM, GET_MY_PROFILE, GET_ONE_TEAM_FROM_ID, GET_ONE_TEAM_FROM_NAME, UPDATE_MY_PROFILE_TEAM_BOARD } from "../../queries"
import { OneTeamFromIdType, OneTeamFromNameType } from "../../../types/queriesType"
import { useControllModal } from "../useControllModal"
import { useMessage } from "../useMessage"

export const useTeamAuth = () => {
    const router = useRouter()

    const { onCloseTeamAuthModal } = useControllModal()

    const { showMessage } = useMessage()

    const [getOneTeamFromNameQuery, {
        loading: loadingOneTeamFromName,
        data: dataOneTeamFromName,
        error: errorOneTeamFromName
    }] = useLazyQuery<OneTeamFromNameType>(GET_ONE_TEAM_FROM_NAME, {
        fetchPolicy: "cache-and-network",
    })
    const[getOneTeamFromIdQuery, {
        loading: loadingOneTeamFromId,
        data: dataOneTeamFromId
    }] = useLazyQuery<OneTeamFromIdType>(GET_ONE_TEAM_FROM_ID, {
        fetchPolicy: "cache-and-network"
    })

    const [createTeamMutation] = useMutation(CREATE_TEAM)
    const [updateMyProfileTeamBoardMutation] = useMutation(UPDATE_MY_PROFILE_TEAM_BOARD, {
        refetchQueries: [{ query: GET_MY_PROFILE }],
    })

    const createTeam = async (name: string, isLimitJoin: boolean, password: string) => {
        try {
            await createTeamMutation({
                variables: {name, isLimitJoin, password}
            })
            showMessage({ title: "チームを作成しました!", status: "success" })
            onCloseTeamAuthModal()
            router.push("/main")
        } catch (err) {
            showMessage({ title: "チーム名は既に使われています。", status: "error"})
        }
    }

    const searchTeam = async (name: string, password: string) => {
        await getOneTeamFromNameQuery({
            variables: {name, password}
        })
    }

    const joinTeam = async (teamBoardId: string) => {
        try {
            await updateMyProfileTeamBoardMutation({
                variables: { teamBoardId }
            })
            showMessage({ title: "チームに加入しました!", status: "success" })
            router.push("/main")
        } catch (err) {
            alert(err)
        }
    }


    return ({ 
        loadingOneTeamFromName,
        dataOneTeamFromName,
        errorOneTeamFromName,
        getOneTeamFromIdQuery,
        loadingOneTeamFromId,
        dataOneTeamFromId,
        createTeam,
        searchTeam,
        joinTeam,
    })
}
