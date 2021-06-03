import { memo, VFC } from "react";
import { useRecoilValue } from "recoil";
import { Box, Stack } from "@chakra-ui/layout";
import { Formik } from "formik";
import { object, string } from 'yup'

import { useGetMyProfile } from "../../../hooks/queries/useGetMyProfile";
import { useUpdateMyProfileNickname } from "../../../hooks/queries/useUpdateMyProfileNickname";
import { useControllModal } from "../../../hooks/useControllModal";
import { useMessage } from "../../../hooks/useMessage";
import { myProfileEditModalState } from "../../../store/myProfileEditModalState";
import { DeleteButton } from "../../atoms/button/DeleteButton";
import { PrimaryButton } from "../../atoms/button/PrimaryButton";
import { ModalLayout } from "../layout/ModalLayout";
import { CustomForm } from "../../molecules/CustomForm";
import { ErrorText } from "../../atoms/text/ErrorText";

export const MyProfileEditModal: VFC = memo(() => {
    const { updateMyProfileNickname } = useUpdateMyProfileNickname()
    const { onCloseMyProfileEditModal, onOpenConfirmTeamLeaveModal, onOpenConfirmUserDeleteModal } = useControllModal()
    const { dataMyProfile } = useGetMyProfile()
    const { showMessage } = useMessage()
    
    const myProfileEditModal = useRecoilValue(myProfileEditModalState)

    return (
        <ModalLayout
            title="プロフィール編集"
            isOpen={myProfileEditModal}
            onClose={onCloseMyProfileEditModal}
        >
            <Formik
                initialValues={{ nickname: dataMyProfile?.myProfile.nickname! }}
                onSubmit={(values) => updateMyProfileNickname(values.nickname) }
                validationSchema={object().shape({
                    nickname: string().required("1文字以上入力してください。").max(20, "20文字以内で入力してください")
                })}
            >
                {({
                    handleSubmit,
                    handleChange,
                    handleBlur,
                    values,
                    errors,
                    touched,
                    isValid,
                }) => (
                    <form onSubmit={handleSubmit}>
                        <Stack spacing={8}>
                            <CustomForm
                                name="nickname"
                                type="text"
                                handleChange={handleChange}
                                handleBlur={handleBlur}
                                value={values.nickname}
                                placeholder="トレーニング太郎"
                            >
                                ニックネーム
                            </CustomForm>
                            {touched.nickname && errors.nickname && (
                                <ErrorText>{errors.nickname}</ErrorText>
                            )}
                            <Box textAlign="center">
                                <PrimaryButton
                                    name='profile-edit'
                                    type="submit"
                                    disabled={!isValid}
                                    onClick={() => null}
                                >
                                    編集する
                                </PrimaryButton>
                            </Box>
                        </Stack>
                    </form>
                )}
            </Formik>
            {dataMyProfile?.myProfile.teamBoard && (
                <Box textAlign="center">
                    <DeleteButton
                        name='confirm-team-leave'
                        type='button'
                        disabled={false}
                        onClick={() => {
                            onCloseMyProfileEditModal()
                            dataMyProfile.myProfile.isCoach ?
                            showMessage({ title: "コーチの権限を他のユーザーに委譲してください。", status: "error" }) :
                            onOpenConfirmTeamLeaveModal("", "", true)
                    }}>
                        チームから脱退する
                    </DeleteButton>
                </Box>
            )}
            <Box textAlign="center" mt={10}>
                <DeleteButton
                    name='confirm-user-delete'
                    type='button'
                    disabled={false}
                    onClick={() => {
                            onCloseMyProfileEditModal()
                            dataMyProfile?.myProfile.isCoach ? 
                            showMessage({ title: "コーチの権限を他のユーザーに委譲してください。", status: "error" }) :
                            onOpenConfirmUserDeleteModal()
                }}>
                    アカウントを削除する
                </DeleteButton>
            </Box>
        </ModalLayout>
    )
})