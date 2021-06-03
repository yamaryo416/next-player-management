import { memo, VFC } from 'react'
import { UserAuthModal } from '../components/organisms/modal/UserAuthModal'
import { HeaderForGeneralUser } from '../components/templates/HeaderForGeneralUser'
import { TopContentsSection } from '../components/templates/TopContentsSection'


const Home: VFC = memo(() => {
    return (
        <> 
            <HeaderForGeneralUser/>
            <UserAuthModal />
            <TopContentsSection />
        </>
    )
})

export default Home