import { memo, VFC } from 'react'
import { Heading, Link } from '@chakra-ui/layout'

import { HeaderLayout } from '../organisms/layout/HeaderLayout'
import { useControllModal } from '../../hooks/useControllModal'

export const HeaderForGeneralUser: VFC = memo(() => {
    const { onOpenUserAuthModal } = useControllModal()

    return (
        <HeaderLayout>
            <Heading as="h1" fontSize={{ base: "15px", md: "30px" }}>
                選手管理APP
            </Heading>
            <Link onClick={() => onOpenUserAuthModal(true)}>ログイン</Link>
        </HeaderLayout>
    )
})
