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
            title="????????????????????????"
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
                        showMessage({ title: '?????????????????????????????????????????????', status: 'error' })
                        
                }}
                validationSchema={object().shape({
                    startDate: date().required('????????????????????????????????????').min(TODAY, '??????????????????????????????????????????'),
                    endDate: date().required('????????????????????????????????????').min(TODAY, '??????????????????????????????????????????')
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
                                <Text>?????????????????????????????????????????????????????????????????????????????????????????????????????????</Text>
                                <Text>??????</Text>
                                <Flex alignItems='center'>
                                    <CustomForm name="startDate" type='date' handleChange={handleChange} handleBlur={handleBlur} value={values.startDate} placeholder="" >
                                        {null}
                                    </CustomForm>
                                    <Text w='40px'>??????</Text>
                                </Flex>
                                {touched.startDate && errors.startDate && (
                                    <ErrorText>{errors.startDate}</ErrorText>
                                )}
                                <Flex alignItems='center'>
                                    <CustomForm name="endDate" type='date' handleChange={handleChange} handleBlur={handleBlur} value={values.endDate} placeholder="" >
                                        {null}
                                    </CustomForm>
                                    <Text w='40px'>??????</Text>
                                </Flex>
                                {touched.endDate && errors.endDate && (
                                    <ErrorText>{errors.endDate}</ErrorText>
                                )}
                                {isTrainingSelect && (
                                    <>
                                        <FormLabel>??????????????????</FormLabel>
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
                                                    <option value="">???????????????????????????</option>
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
                                            {isTrainingSelect ? "????????????????????????????????????" : "?????????????????????????????????"}
                                    </Button>
                                </Box>
                                <Box textAlign="center">
                                    <DeleteButton
                                        name="confirm-schedule-delete"
                                        type='submit'
                                        disabled={!isValid}
                                        onClick={() => null}
                                    >
                                        ??????
                                    </DeleteButton>
                                </Box>
                            </Stack>
                        </form>
                    )}
            </Formik>
        </ModalLayout>
    )
})