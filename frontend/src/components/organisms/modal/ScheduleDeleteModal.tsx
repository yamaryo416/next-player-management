import { memo, useCallback, useState, VFC } from "react";
import { FormLabel } from "@chakra-ui/form-control";
import { Button } from "@chakra-ui/button";
import { Select } from "@chakra-ui/select";
import { Box, Flex, Stack, Text } from "@chakra-ui/layout";
import { useRecoilValue } from "recoil";
import { object, date } from "yup"

import { useControllModal } from "../../../hooks/useControllModal";
import { useScheduleState } from "../../../hooks/useScheduleState";
import { CustomInput } from "../../atoms/input/CustomInput";
import { useDeleteManySchedules } from "../../../hooks/queries/useDeleteManySchedules";
import { useGetMyTeamTrainings } from "../../../hooks/queries/useGetMyTeamTrainings";
import { ModalLayout } from "../layout/ModalLayout";
import { scheduleDeleteModalState } from "../../../store/scheduleDeleteModalState";
import { DeleteButton } from "../../atoms/button/DeleteButton";
import { CustomSpinner } from "../../atoms/spinner/CustomSpinner";
import { Formik } from "formik";
import { TODAY } from "../../../../constants";
import { CustomForm } from "../../molecules/CustomForm";
import { ErrorText } from "../../atoms/text/ErrorText"
import { useMessage } from "../../../hooks/useMessage";

export const ScheduleDeleteModal: VFC = memo(() => {
    const [isTrainingSelect, setIsTrainingSelect] = useState(false)

    const { dataMyTeamTrainings, loadingMyTeamTrainings } = useGetMyTeamTrainings()
    const { onCloseScheduleDeleteModal, onOpenConfirmScheduleDeleteModal } = useControllModal()
    const { deleteManySchedules } = useDeleteManySchedules()
    const { showMessage } = useMessage()

    const scheduleDeleteModal = useRecoilValue(scheduleDeleteModalState)

    const onTrueIsTrainingSelect = useCallback(() => setIsTrainingSelect(true), [])
    const onFalseIsTrainingSelect = useCallback(() => {
        setIsTrainingSelect(false)
    }, [])

    const selectTraining = dataMyTeamTrainings?.myTeamTrainings.edges?.map((train) => (
        <option key={train.node.id} value={train.node.id} data-testid={`${train.node.id}-training`}>
            {train.node.title}
        </option>
    ))

    return (
        <ModalLayout
            title="スケジュール削除"
            isOpen={scheduleDeleteModal}
            onClose={() => {
                onCloseScheduleDeleteModal()
        }}>
            <Formik
                initialValues={{ training: '', startDate: TODAY, endDate: TODAY }}
                onSubmit={(values) => {
                    values.startDate <= values.endDate ? 
                        onOpenConfirmScheduleDeleteModal(
                            values.training,
                            "",
                            "",
                            values.startDate,
                            values.endDate,
                            true,
                        )
                    :
                        showMessage({ title: '期間を正しく入力してください。', status: 'error' })
                        
                }}
                validationSchema={object().shape({
                    startDate: date().required('日付を選択してください。').min(TODAY, '過去の日付は選択できません。'),
                    endDate: date().required('日付を選択してください。').min(TODAY, '過去の日付は選択できません。')
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
                            <Stack spacing={6}>
                                <Text>※トレーニングを指定しない場合、期間全てのスケジュールが削除されます。</Text>
                                <Text>期間</Text>
                                <Flex alignItems='center'>
                                    <CustomForm name="startDate" type='date' handleChange={handleChange} handleBlur={handleBlur} value={values.startDate} placeholder="" >
                                        {null}
                                    </CustomForm>
                                    <Text w='40px'>から</Text>
                                </Flex>
                                {touched.startDate && errors.startDate && (
                                    <ErrorText>{errors.startDate}</ErrorText>
                                )}
                                <Flex alignItems='center'>
                                    <CustomForm name="endDate" type='date' handleChange={handleChange} handleBlur={handleBlur} value={values.endDate} placeholder="" >
                                        {null}
                                    </CustomForm>
                                    <Text w='40px'>まで</Text>
                                </Flex>
                                {touched.endDate && errors.endDate && (
                                    <ErrorText>{errors.endDate}</ErrorText>
                                )}
                                {isTrainingSelect && (
                                    <>
                                        <FormLabel>トレーニング</FormLabel>
                                        <Select
                                            borderColor="gray.400"
                                            borderRadius="1000px"
                                            value={values.training}
                                            data-testid='training-form'
                                            onChange={handleChange}
                                        >
                                            {loadingMyTeamTrainings ? (
                                                <CustomSpinner />
                                            ): (
                                                <>
                                                    <option value="">トレーニングを選択</option>
                                                    {selectTraining}
                                                </>
                                            )}
                                        </Select>
                                    </>
                                )}
                                <Box textAlign="center">
                                    <Button
                                        data-testid='change-training-select-mode-button'
                                        onClick={isTrainingSelect ? onFalseIsTrainingSelect : onTrueIsTrainingSelect}
                                    >
                                            {isTrainingSelect ? "トレーニングを指定しない" : "トレーニングを指定する"}
                                    </Button>
                                </Box>
                                <Box textAlign="center">
                                    <DeleteButton
                                        name="confirm-schedule-delete"
                                        type='submit'
                                        disabled={!isValid}
                                        onClick={() => null}
                                    >
                                        削除
                                    </DeleteButton>
                                </Box>
                            </Stack>
                        </form>
                    )}
            </Formik>
        </ModalLayout>
    )
})