import { memo, useCallback, useState, VFC } from 'react'
import { Button } from '@chakra-ui/button'
import { Box, Heading, Link, Stack, Text } from '@chakra-ui/layout'
import { ModalBody, ModalFooter } from '@chakra-ui/modal'
import { Formik } from 'formik'
import { object, string } from "yup"
import { Checkbox } from '@chakra-ui/checkbox'
import { useRecoilState } from 'recoil'

import { useTeamAuth } from '../../../hooks/queries/useTeamAuth'
import { PrimaryButton } from '../../atoms/button/PrimaryButton'
import { CustomForm } from '../../molecules/CustomForm'
import { ErrorText } from '../../atoms/text/ErrorText'
import { SecondaryButton } from '../../atoms/button/SecondaryButton'
import { useControllModal } from '../../../hooks/useControllModal'
import { ModalLayout } from '../layout/ModalLayout'
import { teamAuthModalState } from '../../../store/teamAuthModalState'
import { useGetMyProfile } from '../../../hooks/queries/useGetMyProfile'

export const TeamAuthModal: VFC = memo(() => {
    const [isSearch, setIsSearch] = useState(false)

    const [teamAuthModal, setTeamAuthModal] = useRecoilState(teamAuthModalState)

    const { dataMyProfile } = useGetMyProfile()
    const { onCloseTeamAuthModal } = useControllModal()
    const { 
        dataOneTeamFromName,
        createTeam,
        searchTeam,
        joinTeam
    } = useTeamAuth()

    const onCloseIsSearch = useCallback(() => setIsSearch(false), [])
    const onClickJoinMode = useCallback(() => setTeamAuthModal({isModalOpen: true, isJoin: true }) ,[])
    const onClickCreateTeamMode = useCallback(() => setTeamAuthModal({isModalOpen: true, isJoin: false }) ,[])

    return (
            <ModalLayout
                title={teamAuthModal.isJoin ? 'チームに加入' : 'チーム作成'}
                isOpen={teamAuthModal.isModalOpen}
                onClose={isSearch ? onCloseIsSearch : onCloseTeamAuthModal}
            >
                {isSearch ? (
                    <>
                        <ModalBody pb={6}>
                        {dataOneTeamFromName ? (
                            <>
                                <Heading
                                    as="h3"
                                    fontSize="23px"
                                    textAlign="left"
                                >以下のチームに加入します。よろしいですか？</Heading>
                                <Text py={10} fontWeight="bold" data-testid='join-team-name'>チーム名: {dataOneTeamFromName.oneTeamFromName.name}</Text>
                                <PrimaryButton
                                    name='join-team'
                                    type="button"
                                    disabled={false}
                                    onClick={() => {
                                        joinTeam(dataOneTeamFromName.oneTeamFromName.teamBoard.id)
                                        onCloseTeamAuthModal()
                                }}>
                                    加入する
                                </PrimaryButton>
                            </>
                        ):(
                            <Heading
                                as="h3"
                                fontSize="23px"
                                textAlign="left"
                                color="red.600"
                            >
                                チーム名もしくはパスワードが間違っています。
                            </Heading>
                        )}
                        </ModalBody>
                    </>
                ): (
                    <>
                        <Formik
                            initialErrors={{ name: "required", password: "required" }}
                            initialValues={{ name: "", password: "0000", isLimitJoin: false }}
                            onSubmit={(values) => {
                                if (teamAuthModal.isJoin) {
                                    searchTeam(values.name, values.password)
                                    setIsSearch(true)
                                } else {
                                    createTeam(values.name, values.isLimitJoin, values.password)
                            }}}
                            validationSchema={object().shape({
                                name: string().required("1文字以上入力してください。").max(20, '20文字以内で入力してください。'),
                                password: string().required("パスワードは必須です。").matches(/^[0-9]{4}$/, "4桁の数字を入力してください。")
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
                                        <CustomForm name="name" type="text" handleChange={handleChange} handleBlur={handleBlur} value={values.name} placeholder="〇〇チーム" >
                                            チーム名
                                        </CustomForm> 
                                        {touched.name && errors.name && (
                                            <ErrorText>{errors.name}</ErrorText>
                                        )}
                                        <Checkbox data-testid='is-limit-join'　name="isLimitJoin" isChecked={values.isLimitJoin} onChange={handleChange}>{teamAuthModal.isJoin ? "パスワードが必要なため入力する" : "パスワードを設定し、参加を制限する"}</Checkbox>
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
                                        <Box textAlign="center">
                                            <PrimaryButton
                                                name={teamAuthModal.isJoin ? 'confirm-team-join' : 'team-create'}
                                                type="submit"
                                                disabled={!isValid}
                                                onClick={() => null}
                                            >
                                                {teamAuthModal.isJoin ? 'チームに加入する' : 'チームを作成する'}
                                            </PrimaryButton>
                                        </Box>
                                    </Stack>
                                </form>
                            )}
                        </Formik>
                        {!dataMyProfile?.myProfile.isGuest && (
                            <Box textAlign="center">
                                <Link
                                    onClick={teamAuthModal.isJoin ? onClickCreateTeamMode : onClickJoinMode}
                                    fontSize="13px"
                                >
                                    {teamAuthModal.isJoin ? 'チームを作成する場合はこちら' : '既にあるチームに加入する場合はこちら'}
                                </Link>
                            </Box>
                        )}
                    </>
                )}
            </ModalLayout>
)})
