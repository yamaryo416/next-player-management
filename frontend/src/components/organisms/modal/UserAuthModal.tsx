import { memo, VFC } from 'react'
import { Box, Link, Stack } from '@chakra-ui/layout'
import { Formik } from 'formik'
import { object, string } from 'yup'

import { CustomForm } from '../../molecules/CustomForm'
import { ErrorText } from '../../atoms/text/ErrorText'
import { PrimaryButton } from '../../atoms/button/PrimaryButton'
import { useUserAuth } from '../../../hooks/queries/useUserAuth'
import { useControllModal } from '../../../hooks/useControllModal'
import { ModalLayout } from '../layout/ModalLayout'
import { useRecoilState, useRecoilValue } from 'recoil'
import { userAuthModalState } from '../../../store/userAuthModalState'

export const UserAuthModal: VFC = memo(() => {
    const { onCloseUserAuthModal } = useControllModal()
    const { signup, login } = useUserAuth()

    const [userAuthModal, setUserAuthModal] = useRecoilState(userAuthModalState)

    return (
        <ModalLayout
            title={userAuthModal.isLogin ? "ログイン" : "新規登録"}
            isOpen={userAuthModal.isModalOpen}
            onClose={onCloseUserAuthModal}
        >
            <Formik
                initialErrors={{ email: "required" }}
                initialValues={{ nickname: "名無し", email: "", password: "", password_confirmation: "" }}
                onSubmit={(values) => {
                    userAuthModal.isLogin ? login(values.email, values.password) : signup(values)
                }}
                validationSchema={object().shape({
                    nickname: string().required("1文字以上入力してください。").max(20, "20文字以内で入力してください"),
                    email: string().email("正しいEmailを入力してください。").required("Emailは必須です。"),
                    password: string().required("パスワードは必須です。").min(6, "6文字以上で入力してください"),
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
                            {!userAuthModal.isLogin && (
                                <>
                                    <CustomForm name="nickname" type="text" handleChange={handleChange} handleBlur={handleBlur} value={values.nickname} placeholder="トレーニング太郎" >
                                        ニックネーム
                                    </CustomForm>
                                    {touched.nickname && errors.nickname && (
                                        <ErrorText>{errors.nickname}</ErrorText>
                                    )}
                                </>
                            )}
                            <CustomForm name="email" type="email" handleChange={handleChange} handleBlur={handleBlur} value={values.email} placeholder="training@example.com">
                                Eメール
                            </CustomForm>
                            {touched.email && errors.email && (
                                <ErrorText>{errors.email}</ErrorText>
                            )}
                            <CustomForm name="password" type="password" handleChange={handleChange} handleBlur={handleBlur} value={values.password} placeholder="">
                                パスワード
                            </CustomForm>
                            {touched.password && errors.password && (
                                <ErrorText>{errors.password}</ErrorText>
                            )}
                            {!userAuthModal.isLogin && (
                                <CustomForm name="password_confirmation" type="password" handleChange={handleChange} handleBlur={handleBlur} value={values.password_confirmation} placeholder="">
                                    パスワード
                                </CustomForm>
                            )}
                            <Box textAlign="center">
                                <PrimaryButton
                                    name={userAuthModal.isLogin ? 'login' : 'signup'}
                                    type="submit"
                                    disabled={!isValid}
                                    onClick={() => null}
                                >
                                    {userAuthModal.isLogin ? 'ログイン' : "ユーザー登録"}
                                </PrimaryButton>
                            </Box>
                        </Stack>
                    </form>
                )}
            </Formik>
            <Box textAlign="center">
                <Link
                    onClick={() => setUserAuthModal({ ...userAuthModal, isLogin: !userAuthModal.isLogin })}
                    fontSize="13px"
                >
                    {userAuthModal.isLogin ? 'アカウントを持っていない場合はこちら': '既にアカウントを持っている場合はこちら'}
                </Link>
            </Box>
        </ModalLayout>
    )
})

