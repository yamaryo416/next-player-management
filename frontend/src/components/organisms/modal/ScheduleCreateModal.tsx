import { memo, useState, VFC } from "react"
import { FormControl, FormLabel } from "@chakra-ui/form-control"
import { Box, Flex, Heading, Link, Stack, Text } from "@chakra-ui/layout"
import { Select } from "@chakra-ui/select"

import { DAY_OF_WEEK, TODAY } from "../../../../constants"
import { useControllModal } from "../../../hooks/useControllModal"
import { useCreateManySchedules } from "../../../hooks/queries/useCreateManySchedules"
import { useCreateSingleSchedule } from "../../../hooks/queries/useCreateSingleSchedule"
import { useScheduleState } from "../../../hooks/useScheduleState"
import { CustomInput } from "../../atoms/input/CustomInput"
import { PrimaryButton } from "../../atoms/button/PrimaryButton"
import { useGetMyTeamTrainings } from "../../../hooks/queries/useGetMyTeamTrainings"
import { Spinner } from "@chakra-ui/spinner"
import { ModalLayout } from "../layout/ModalLayout"
import { Button } from "@chakra-ui/button"
import { useRecoilValue } from "recoil"
import { scheduleCreateModalState } from "../../../store/scheduleCreateModalState"
import { CustomSpinner } from "../../atoms/spinner/CustomSpinner"
import { Formik } from "formik"
import { object, string, date } from "yup"
import { CustomForm } from "../../molecules/CustomForm"
import { ErrorText } from "../../atoms/text/ErrorText"

export const ScheduleCreateModal:VFC = memo(() => {
    const { onCloseScheduleCreateModal } = useControllModal()
    const { loadingMyTeamTrainings, dataMyTeamTrainings, errorMyTeamTrainings } = useGetMyTeamTrainings()
    const { createSingleSchedule } = useCreateSingleSchedule()
    const { createManySchedules } = useCreateManySchedules()
    const { 
        isSingleSchedule,
        dayOfWeek,
        onClickChangeMode,
        onChangeDayOfWeek,
        includeWeekDays,
    } = useScheduleState()

    const scheduleCreateModal = useRecoilValue(scheduleCreateModalState)

    const selectTraining = dataMyTeamTrainings?.myTeamTrainings.edges?.map((train) => (
        <option　key={train.node.id} value={train.node.id} data-testid={`${train.node.id}-training`}>
            {train.node.title}
        </option>
    ))

    const selectWeekDay = DAY_OF_WEEK.map((w, i) => (
        <Flex>
            <label>{w}</label>
            <Box pr={4}>
                <input type="checkbox" value={i} checked={includeWeekDays(i)} data-testid={`week-${i}`} onChange={onChangeDayOfWeek}/>
            </Box>
        </Flex>
    ))
 
    return (
        <ModalLayout
            title={isSingleSchedule ? "スケジュール作成(一日のみ)" : "スケジュール作成(期間指定)" }
            isOpen={scheduleCreateModal}
            onClose={() => {
                onCloseScheduleCreateModal()
        }}>
            {errorMyTeamTrainings ? (
                <Heading as="h3" fontSize="20px">トレーニングの取得に失敗しました。</Heading>
            ):(
                <Formik
                    initialErrors={{ training: 'required', date: 'required', startDate: 'required', endDate: 'required' }}
                    initialValues={{ training: '' ,date: TODAY, startDate: TODAY, endDate: TODAY }}
                    onSubmit={(values) => {
                        isSingleSchedule ? createSingleSchedule(values.training, values.date) : createManySchedules(values.training, values.startDate, values.endDate, dayOfWeek)
                    }}
                    validationSchema={object().shape({
                        training: string().required('トレーニングを選択してください'),
                        date: date().required('日付を選択してください。').min(TODAY, '過去の日付は選択できません。'),
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
                            <Stack spacing={4}>
                                <FormControl>
                                    <FormLabel>トレーニング</FormLabel>
                                    <Select
                                        name='training'
                                        borderColor="gray.400"
                                        borderRadius="1000px"
                                        value={values.training}
                                        data-testid='training-form'
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    >
                                        <option value="" data-testid='not-training'>---</option>
                                        {loadingMyTeamTrainings ?
                                            <CustomSpinner /> : (
                                                <>
                                                    {selectTraining}
                                                </>
                                            )
                                        }
                                    </Select>
                                </FormControl>
                                {touched.training && errors.training && (
                                    <ErrorText>{errors.training}</ErrorText>
                                )}
                                {isSingleSchedule ? (
                                    <>
                                        <CustomForm name="date" type='date' handleChange={handleChange} handleBlur={handleBlur} value={values.date} placeholder="" >
                                            日付
                                        </CustomForm>
                                        {touched.date && errors.date && (
                                            <ErrorText>{errors.date}</ErrorText>
                                        )}
                                    </>
                                ): (
                                    <>
                                        <CustomForm name="startDate" type='date' handleChange={handleChange} handleBlur={handleBlur} value={values.startDate} placeholder="" >
                                            開始日
                                        </CustomForm> 
                                        {touched.startDate && errors.startDate && (
                                            <ErrorText>{errors.startDate}</ErrorText>
                                        )}
                                        <CustomForm name="endDate" type='date' handleChange={handleChange} handleBlur={handleBlur} value={values.endDate} placeholder="" >
                                            終了日
                                        </CustomForm> 
                                        {touched.endDate && errors.endDate && (
                                            <ErrorText>{errors.endDate}</ErrorText>
                                        )}
                                        <Text>曜日指定</Text>
                                        <Flex>
                                            {selectWeekDay}
                                        </Flex>
                                    </>
                                )}
                                 <Box textAlign="center">
                                    <PrimaryButton
                                        name='schedule-create'
                                        type="submit"
                                        disabled={!isValid}
                                        onClick={() => null}
                                        
                                    >
                                        スケジュールを作成する
                                    </PrimaryButton>
                                </Box>
                            </Stack>
                        </form>
                    )}
                </Formik>
            )}
            <Box textAlign="center">
                <Button
                    data-testid='change-create-schedule-mode-button'
                    onClick={onClickChangeMode}
                    fontSize="15px"
                >
                    {isSingleSchedule ? "期間指定に切り替える" : "一日のみに切り替える"}
                </Button>
            </Box>
        </ModalLayout>
    )
})
