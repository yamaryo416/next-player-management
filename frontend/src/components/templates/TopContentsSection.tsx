import { Button } from "@chakra-ui/button";
import { Box, Stack } from "@chakra-ui/layout";
import { memo, VFC } from "react";
import { useUserAuth } from "../../hooks/queries/useUserAuth";
import { useControllModal } from "../../hooks/useControllModal";
import { PrimaryButton } from "../atoms/button/PrimaryButton";

export const TopContentsSection: VFC = memo(() => {
    const { onOpenUserAuthModal } = useControllModal()
    const { joinGuestUser } = useUserAuth()

    return (
        <Box pt="100px" textAlign="center">
            <Stack>
                <Box textAlign="center">
                    <PrimaryButton
                        name='login-modal'
                        type="button"
                        disabled={false}
                        onClick={() => onOpenUserAuthModal(true)}
                    >
                        ログイン
                    </PrimaryButton>
                </Box>
                <Box textAlign="center">
                    <PrimaryButton
                        name='signup-modal'
                        type="button"
                        disabled={false}
                        onClick={() => onOpenUserAuthModal(false)}
                    >
                        新規登録
                    </PrimaryButton>
                </Box>
                <Box textAlign="center">
                    <Button
                        onClick={joinGuestUser}
                    >
                        ゲストとして参加
                    </Button>
                </Box>
            </Stack>
        </Box>
    )
})