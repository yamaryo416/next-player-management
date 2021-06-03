import { memo, VFC } from "react";
import { Formik } from "formik";
import { object, string } from "yup"
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Box, Stack } from "@chakra-ui/layout";
import { Checkbox } from "@chakra-ui/checkbox";
import { Textarea } from "@chakra-ui/textarea";
import { useRecoilValue } from "recoil";

import { useGetMyProfile } from "../../../hooks/queries/useGetMyProfile";
import { useControllModal } from "../../../hooks/useControllModal";
import { CustomForm } from "../../molecules/CustomForm";
import { ErrorText } from "../../atoms/text/ErrorText";
import { PrimaryButton } from "../../atoms/button/PrimaryButton";
import { useUpdateTeam } from "../../../hooks/queries/useUpdateTeam";
import { useUpdateTeamBoardIntroduction } from "../../../hooks/queries/useUpdateTeamBoardIntroduction";
import { ModalLayout } from "../layout/ModalLayout";
import { teamEditModalState } from "../../../store/teamEditModalState";
import { CustomSpinner } from "../../atoms/spinner/CustomSpinner";

export const TeamEditModal: VFC = memo(() => {
    const { onCloseTeamEditModal } = useControllModal()
    const { dataMyProfile, loadingMyProfile } = useGetMyProfile()
    const { updateTeam } = useUpdateTeam()
    const { updateTeamBoardIntroduction } = useUpdateTeamBoardIntroduction()

    const teamEditModal = useRecoilValue(teamEditModalState)

    return (
        <>
            {loadingMyProfile ? (
                <CustomSpinner />
            ):(
                <ModalLayout
                    title="チーム編集"
                    isOpen={teamEditModal}
                    onClose={onCloseTeamEditModal}
                >
                    <Formik
                        initialErrors={{ name: "required", password: "required" }}
                        initialValues={{ 
                            name: dataMyProfile?.myProfile.teamBoard.team.name!,
                            password: dataMyProfile?.myProfile.teamBoard.team.password!,
                            isLimitJoin: dataMyProfile?.myProfile.teamBoard.team.isLimitJoin!,
                            introduction: dataMyProfile?.myProfile.teamBoard.introduction!
                        }}
                        onSubmit={(values) => {
                            updateTeamBoardIntroduction(values.introduction)
                            updateTeam(values.name, values.isLimitJoin, values.password )
                        }}
                        validationSchema={object().shape({
                            name: string().required("1文字以上入力してください。").max(20, '20文字以内で入力してください。'),
                            password: string().required("パスワードは必須です。").matches(/^[0-9]{4}$/, "4桁の数字を入力してください。"),
                            introduction: string().max(100, '100文字以内で入力してください。')
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
                                <Stack spacing={4}>
                                    <CustomForm name="name" type="text" handleChange={handleChange} handleBlur={handleBlur} value={values.name} placeholder="〇〇チーム">
                                        チーム名
                                    </CustomForm>
                                    {touched.name && errors.name && (
                                        <ErrorText>{errors.name}</ErrorText>
                                    )}
                                    <Checkbox
                                        name="isLimitJoin" 
                                        checked={values.isLimitJoin}
                                        onChange={handleChange}
                                        data-testid='is-limit-join'
                                    >
                                        パスワードを設定し、参加を制限する
                                    </Checkbox>
                                    {values.isLimitJoin && (
                                        <>
                                        <CustomForm name="password" type="text" handleChange={handleChange} handleBlur={handleBlur} value={values.password} placeholder="0000" >
                                            パスワード
                                        </CustomForm> 
                                        {touched.password && errors.password && (
                                            <ErrorText>{errors.password}</ErrorText>
                                        )}
                                        </>
                                    )}
                                    <FormControl>
                                        <FormLabel fontSize="20px">紹介文</FormLabel>
                                        <Textarea 
                                            name="introduction"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.introduction}
                                            borderColor="gray.400"
                                            borderRadius="20px"
                                            placeholder="よろしくお願いします。"
                                            height="200px"
                                            data-testid='introduction-form'
                                        />
                                        {touched.introduction && errors.introduction && (
                                            <ErrorText>{errors.introduction}</ErrorText>
                                        )}
                                    </FormControl>
                                    <Box textAlign="center">
                                        <PrimaryButton
                                            name='team-edit'
                                            type="submit"
                                            disabled={!isValid}
                                            onClick={() => null}
                                        >
                                            チームを編集する
                                        </PrimaryButton>
                                    </Box>
                                </Stack>
                            </form>
                        )}
                    </Formik>
                </ModalLayout>
            )}
        </>
    )
})