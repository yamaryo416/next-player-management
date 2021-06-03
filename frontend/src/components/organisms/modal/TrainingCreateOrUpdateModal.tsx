import { ChangeEvent, memo, useCallback, useState, VFC } from "react"
import { Button } from "@chakra-ui/button"
import { Box, Flex, HStack,  Stack, Text, Wrap, WrapItem } from "@chakra-ui/layout"
import { useRecoilState, useRecoilValue } from "recoil"
import { object, string, number } from 'yup'

import { useControllModal } from "../../../hooks/useControllModal"
import { useCreateTraining } from "../../../hooks/queries/useCreateTraining"
import { TrainingIcon } from "../../molecules/TrainingIcon"
import { PrimaryButton } from "../../atoms/button/PrimaryButton"
import { ModalLayout } from "../layout/ModalLayout"
import { trainingCreateOrUpdateModalState } from "../../../store/triningCreateOrUpdateModalState"
import { useUpdateTraining } from "../../../hooks/queries/useUpdateTraining"
import { Formik } from "formik"
import { CustomForm } from "../../molecules/CustomForm"
import { useNumber } from "../../../hooks/useNumber"
import { ErrorText } from "../../atoms/text/ErrorText"
import { useTrainingState } from "../../../hooks/useTrainingState"

export const TrainingCreateOrUpdateModal:VFC = memo(() => {
    const { onCloseTrainingCreateOrUpdateModal } = useControllModal()
    const { isIconSelect, onChangeIsIconSelect } = useTrainingState()
    const { undefinedNumber } = useNumber()
    const { createTraining } = useCreateTraining()
    const { updateTraining } = useUpdateTraining()

    const [trainingCreateOrUpdateModal, setTrainingCreateOrUpdateModal] = useRecoilState(trainingCreateOrUpdateModalState)

    const { id, title, count, load, distance, description, iconNumber,  isCreate, isModalOpen } = trainingCreateOrUpdateModal

    const onChangeIconNumber = useCallback((e: ChangeEvent<HTMLInputElement>) => 
        setTrainingCreateOrUpdateModal({ ...trainingCreateOrUpdateModal, iconNumber: Number(e.target.value) } )
    , [trainingCreateOrUpdateModal])


    const selectIcon = [...Array(11)].map((_, i) => (
        <WrapItem key={i + 1}>
            <Box textAlign="center">
                <Box>
                    <TrainingIcon iconNumber={i + 1} color="black" size="50px" />
                </Box>
                <input name="icon" type="radio" value={i + 1}  onChange={onChangeIconNumber} checked={i + 1 === iconNumber} />
            </Box>
        </WrapItem>
    ))

    return (
        <ModalLayout
            title={isCreate ? "トレーニング作成" : "トレーニング編集" }
            isOpen={isModalOpen}
            onClose={() => {
                onCloseTrainingCreateOrUpdateModal()
            }}
        >
            <Formik
                initialValues={{
                    title,
                    count,
                    load,
                    distance,
                    description,
                }}
                onSubmit={(values) => {
                    isCreate ?
                    createTraining(values.title, undefinedNumber(values.count), undefinedNumber(values.load), undefinedNumber(values.distance), values.description, undefinedNumber(iconNumber)) :
                    updateTraining(id, values.title, undefinedNumber(values.count), undefinedNumber(values.load), undefinedNumber(values.distance), values.description, undefinedNumber(iconNumber))
                }}
                validationSchema={object().shape({
                    title: string().required('1文字以上入力してください。').max(20, "20文字以内で入力してください"),
                    count: number(),
                    load: number(),
                    distance: number()
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
                            <CustomForm
                                name="title"
                                type="text"
                                handleChange={handleChange}
                                handleBlur={handleBlur}
                                value={values.title}
                                placeholder="ランニング"
                            >
                                トレーニング名
                            </CustomForm>
                            {touched.title && errors.title && (
                                <ErrorText>{errors.title}</ErrorText>
                            )}
                            <Flex>
                                <HStack spacing={7}>
                                    <CustomForm
                                        name="count"
                                        type="number"
                                        handleChange={handleChange}
                                        handleBlur={handleBlur}
                                        value={values.count}
                                        placeholder="0"
                                    >
                                        回数(回)
                                    </CustomForm>
                                    <CustomForm
                                        name="load"
                                        type="number"
                                        handleChange={handleChange}
                                        handleBlur={handleBlur}
                                        value={values.load}
                                        placeholder="0"
                                    >
                                        負荷(kg)
                                    </CustomForm>
                                    <CustomForm
                                        name="distance"
                                        type="number"
                                        handleChange={handleChange}
                                        handleBlur={handleBlur}
                                        value={values.distance}
                                        placeholder="0"
                                    >
                                        距離(km)
                                    </CustomForm>
                                </HStack>
                            </Flex>
                            <CustomForm
                                name="description"
                                type="string"
                                handleChange={handleChange}
                                handleBlur={handleBlur}
                                value={values.description}
                                placeholder="早めのペースで走りましょう"
                            >
                                説明
                            </CustomForm>
                            <Box textAlign="center">
                                <Button data-testid='change-icon-select-mode' onClick={onChangeIsIconSelect}>アイコンを選択する</Button>
                            </Box>
                            {isIconSelect && (
                                <Wrap>
                                    {selectIcon}
                                </Wrap>
                            )}
                              <Box textAlign="center">
                                <PrimaryButton
                                    name='training-create'
                                    type="submit"
                                    disabled={!isValid}
                                    onClick={() => null}
                                >
                                    {isCreate ? "トレーニンングを作成する" : "編集する"}
                                </PrimaryButton>
                            </Box>
                        </Stack>
                    </form>
                 )}
            </Formik>
        </ModalLayout>
    )
})
