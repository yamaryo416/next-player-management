import { useCallback } from "react"
import { useRecoilState, useSetRecoilState } from "recoil"

import { confirmHandOffCoachModalState } from "../store/confirmHandOffCoachModalState"
import { confirmPostDeleteModalState } from "../store/confirmPostDeleteModalState"
import { confirmScheduleDeleteModalState } from "../store/confirmScheduleDeleteModalState"
import { confirmTeamJoinModalState } from "../store/confirmTeamJoinModalState"
import { confirmTeamLeaveModalState } from "../store/confirmTeamLeaveModalState"
import { confirmTrainingDeleteState } from "../store/confirmtTrainingDeleteModalState"
import { confirmUserDeleteModalState } from "../store/confirmUserDeleteModalState"
import { myProfileEditModalState } from "../store/myProfileEditModalState"
import { oneMemberSelectedModalState } from "../store/oneMemberSelectedModalState"
import { scheduleCreateModalState } from "../store/scheduleCreateModalState"
import { scheduleDeleteModalState } from "../store/scheduleDeleteModalState"
import { scheduleFinishedModalState } from "../store/scheduleFinishedModalState"
import { teamAuthModalState } from "../store/teamAuthModalState"
import { teamEditModalState } from "../store/teamEditModalState"
import { trainingDetailModalState } from "../store/trainingDetailModalState"
import { trainingCreateOrUpdateModalState } from "../store/triningCreateOrUpdateModalState"
import { userAuthModalState } from "../store/userAuthModalState"

export const useControllModal = () => {
    const setUserAuthModal = useSetRecoilState(userAuthModalState)
    const setTeamAuthModal = useSetRecoilState(teamAuthModalState)
    const setTeamEditModal = useSetRecoilState(teamEditModalState)
    const setConfirmTeamJoinModal = useSetRecoilState(confirmTeamJoinModalState)
    const setConfirmTeamLeaveModal = useSetRecoilState(confirmTeamLeaveModalState)
    const setConfirmUserDeleteModal = useSetRecoilState(confirmUserDeleteModalState)
    const setMyProfileEditModal = useSetRecoilState(myProfileEditModalState)
    const setConfirmHandOffCoachModal = useSetRecoilState(confirmHandOffCoachModalState)
    const setTrainingDetailModal = useSetRecoilState(trainingDetailModalState)
    const setScheduleCreateModal = useSetRecoilState(scheduleCreateModalState)
    const setScheduleDeleteModal = useSetRecoilState(scheduleDeleteModalState)
    const setConfirmScheduleDeleteModal = useSetRecoilState(confirmScheduleDeleteModalState)
    const setScheduleFinishedModal = useSetRecoilState(scheduleFinishedModalState)
    const setConfirmPostDeleteModal = useSetRecoilState(confirmPostDeleteModalState)
    const setOneMemberSelectedModal = useSetRecoilState(oneMemberSelectedModalState)
    const [confirmTrainingDeleteModal, setConfirmTrainingDeleteModal] = useRecoilState(confirmTrainingDeleteState)
    const [trainingCreateOrUpdateModal, setTrainingCreateOrUpdateModal] = useRecoilState(trainingCreateOrUpdateModalState)

    const onOpenUserAuthModal = useCallback((isLogin: boolean) => setUserAuthModal({ isLogin, isModalOpen: true }), [])
    const onCloseUserAuthModal = useCallback(() => setUserAuthModal({ isLogin: true, isModalOpen: false }), [])

    const onOpenTeamAuthModal = useCallback((isJoin: boolean) => setTeamAuthModal({ isModalOpen: true, isJoin }), [])
    const onCloseTeamAuthModal = useCallback(() => setTeamAuthModal({ isModalOpen: false, isJoin: false }), [])

    const onOpenTeamEditModal = useCallback(() => setTeamEditModal(true), [])
    const onCloseTeamEditModal = useCallback(() => setTeamEditModal(false), [])
    
    const onOpenConfrimTeamJoinModal = useCallback(() => setConfirmTeamJoinModal(true), [])
    const onCloseConfrimTeamJoinModal = useCallback(() => setConfirmTeamJoinModal(false), [])

    const onOpenConfirmTeamLeaveModal = useCallback(
        (id: string, nickname: string, isMyself: boolean) =>  {
            setConfirmTeamLeaveModal({ id, nickname, isMyself, isModalOpen: true })
    }, [])
    const onCloseConfirmTeamLeaveModal = useCallback(() =>  {
            setConfirmTeamLeaveModal({ id: "", nickname: "", isMyself: true, isModalOpen: false })
    }, [])

    const onOpenConfirmUserDeleteModal = useCallback(() => setConfirmUserDeleteModal(true), [])
    const onCloseConfirmUserDeleteModal = useCallback(() => setConfirmUserDeleteModal(false), []) 

    const onOpenMyProfileEditModal = useCallback(() => setMyProfileEditModal(true), [])
    const onCloseMyProfileEditModal = useCallback(() => setMyProfileEditModal(false), [])

    const onOpenConfirmHandOffCoachModal = useCallback(
        (id: string, nickname: string) => setConfirmHandOffCoachModal({ id, nickname, isModalOpen: true })
        , [])

    const onCloseConfirmHandOffCoachModal = useCallback(
        () => setConfirmHandOffCoachModal({ id: "", nickname: "", isModalOpen: false })
        , [])

    const onOpenTrainingCreateModal = useCallback(
        () => setTrainingCreateOrUpdateModal({...trainingCreateOrUpdateModal, isModalOpen: true, isCreate: true }), 
    [])
    const onOpenTrainingUpdateModal = useCallback(
        (
            id: string,
            title: string,
            count: number | undefined,
            load: number | undefined,
            distance: number | undefined,
            description: string,
            iconNumber: number | undefined,
        ) => 
            setTrainingCreateOrUpdateModal({ id, title, count, load, distance, description, iconNumber,  isModalOpen: true, isCreate: false })
    , [])
    const onCloseTrainingCreateOrUpdateModal = useCallback(
        () => setTrainingCreateOrUpdateModal({ 
            id: '',
            title: '',
            count: undefined,
            load: undefined, 
            distance: undefined,
            description: '',
            iconNumber: undefined,
            isModalOpen: false,
            isCreate: false,
            }) 
    , [])



    const onOpneTrainingDetailModal = useCallback(
        (
            title: string,
            count: number | undefined,
            load: number | undefined,
            distance: number | undefined,
            description: string,
            iconNumber: number | undefined
        ) => {
             setTrainingDetailModal({
                 title,
                 count,
                 load,
                 distance,
                 description,
                 iconNumber,
                 isOpen: true
            })
    }, [])
    const onCloseTrainingDetailModal = useCallback(
        () => {
            setTrainingDetailModal({
                title: '',
                count: undefined,
                load: undefined,
                distance: undefined,
                description: undefined,
                iconNumber: undefined,
                isOpen: false
            })
    }, [])

    const onOpenConfirmTrainingDeleteModal = useCallback(
        (
            id: string,
            title: string,
            count: number | undefined,
            load: number | undefined,
            distance: number | undefined,
            description: string
        ) => {
            setConfirmTrainingDeleteModal({
                id,
                title,
                count,
                load,
                distance,
                description,
                isOpen: true
            })
    }, [])
    const onCloseConfirmTrainingDeleteModal = useCallback(
        () => {
            setConfirmTrainingDeleteModal({
                id: '',
                title: '',
                count: undefined,
                load: undefined,
                distance: undefined,
                description: '',
                isOpen: false
            })
    }, [])

    const onOpenScheduleCreateModal = useCallback(() => setScheduleCreateModal(true), [])
    const onCloseScheduleCreateModal = useCallback(() => setScheduleCreateModal(false), [])

    const onOpenScheduleDeleteModal = useCallback(() => setScheduleDeleteModal(true), [])
    const onCloseScheduleDeleteModal = useCallback(() => setScheduleDeleteModal(false), [])

    const onOpenConfirmScheduleDeleteModal = useCallback(
        (id: string, title: string, date: string, startDate: string, endDate: string, isManySchedule: boolean) => 
            setConfirmScheduleDeleteModal({
                id,
                title,
                date,
                startDate,
                endDate,
                isManySchedule,
                isModalOpen: true,
            })
    , [])
    const onCloseConfirmScheduleDeleteModal = useCallback(() => 
        setConfirmScheduleDeleteModal({
            id: "",
            title: "",
            date: "",
            startDate: "",
            endDate: "",
            isManySchedule: false,
            isModalOpen: false,
        })
    , [])

    const onOpenScheduleFinished = useCallback(
        (id: string, title: string, date: string, isOpen: "section" | "modal") => 
            setScheduleFinishedModal({ id, title, date, isOpen })
    , [])
    const onCloseScheduleFinished = useCallback(() =>
        setScheduleFinishedModal({
            id: "",
            title: "",
            date: "",
            isOpen: false
        })
    ,[])

    const onOpenConfirmPostDeleteModal = useCallback(
        (id: string, text: string, isModalOpen: boolean) => {
            setConfirmPostDeleteModal({
                id, text, isModalOpen
            })
    }, [])
    const onCloseConfirmPostDeleteModal = useCallback(() => {
        setConfirmPostDeleteModal({
            id: "",
            text: "",
            isModalOpen: false
        })
    }, [])

    const onOpenOneMemberSelected = useCallback(
        (id: string, nickname: string, isCoach: boolean, isOpen: boolean) => {
        setOneMemberSelectedModal({
            id,
            nickname,
            isCoach,
            isOpen
        })
    }, [])
    const onCloseOneMemberSelected = useCallback(() => 
        setOneMemberSelectedModal({
            id: "",
            nickname: "",
            isCoach: false,
            isOpen: false
        })
    , [])

    return {
        onOpenUserAuthModal,
        onCloseUserAuthModal,
        onOpenTeamAuthModal,
        onCloseTeamAuthModal,
        onOpenTeamEditModal,
        onCloseTeamEditModal,
        onOpenConfrimTeamJoinModal,
        onCloseConfrimTeamJoinModal,
        onOpenConfirmTeamLeaveModal,
        onCloseConfirmTeamLeaveModal,
        onOpenConfirmUserDeleteModal,
        onCloseConfirmUserDeleteModal,
        onOpenMyProfileEditModal,
        onCloseMyProfileEditModal,
        onOpenConfirmHandOffCoachModal,
        onCloseConfirmHandOffCoachModal,
        onOpenTrainingCreateModal,
        onOpenTrainingUpdateModal,
        onCloseTrainingCreateOrUpdateModal,
        onOpneTrainingDetailModal,
        onCloseTrainingDetailModal,
        onOpenConfirmTrainingDeleteModal,
        onCloseConfirmTrainingDeleteModal,
        onOpenScheduleCreateModal,
        onCloseScheduleCreateModal,
        onOpenScheduleDeleteModal,
        onCloseScheduleDeleteModal,
        onOpenConfirmScheduleDeleteModal,
        onCloseConfirmScheduleDeleteModal,
        onOpenScheduleFinished,
        onCloseScheduleFinished,
        onOpenConfirmPostDeleteModal,
        onCloseConfirmPostDeleteModal,
        onOpenOneMemberSelected,
        onCloseOneMemberSelected
    }
}