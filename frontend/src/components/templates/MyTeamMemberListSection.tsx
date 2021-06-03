import { ChangeEvent, memo, useCallback, useState, VFC } from "react";
import { Box, Flex, Text } from "@chakra-ui/layout";

import { SectionTitle } from "../atoms/title/SectionTitle";
import { useGetMoreMyTeamMember } from "../../hooks/queries/useGetMoreMyTeamMember";
import { SectionCard } from "../organisms/layout/SectionCard";
import { CustomSpinner } from "../atoms/spinner/CustomSpinner";
import { FailedText } from "../atoms/text/FailedText";
import { NUM_PAGE } from "../../../constants";
import { MyTeamMemberType } from "../../../types/queriesType";
import { Input } from "@chakra-ui/input";
import { MyTeamMemberListItem } from "../organisms/member/MyTeamMemberListItem";
import { PrimaryButton } from "../atoms/button/PrimaryButton";
import { FetchMoreLink } from "../atoms/link/FetchMoreLink";
import { SectionCloseLink } from "../atoms/link/SectionCloseLink";

export const MyTeamMemberListSection: VFC = memo(() => {
    const [tentativeNidkname, setTentativeNickname] = useState("")
    const [nickname, setNickname] = useState("")
    const [isSearchMode, setIsSearchMode] = useState(false)

    const { loadingMoreMyTeamMember, dataMoreMyTeamMember, errorMoreMyTeamMember, fetchMore } = useGetMoreMyTeamMember()

    const onChangeTentativeNickname = useCallback((e: ChangeEvent<HTMLInputElement>) =>  setTentativeNickname(e.target.value), [])
    
    const fetchFirstMember = useCallback(() => {
            fetchMore({
                variables: {
                    first: NUM_PAGE,
                },
                updateQuery: (prevLoad, { fetchMoreResult }): MyTeamMemberType => {
                    return fetchMoreResult!
                },
            })
    }, [])

    const fetchMoreMember = useCallback(() => {
            fetchMore({
                variables: {
                    nickname,
                    first: NUM_PAGE,
                    after: dataMoreMyTeamMember?.myTeamMember.pageInfo.endCursor || null
                },
                updateQuery: (prevLoad, { fetchMoreResult }): MyTeamMemberType => {
                    if (!fetchMoreResult) return prevLoad
                    fetchMoreResult!.myTeamMember.edges = [
                        ...prevLoad.myTeamMember.edges!,
                        ...fetchMoreResult.myTeamMember.edges!,
                    ]
                    return fetchMoreResult
                },
            })
    }, [nickname, dataMoreMyTeamMember])

    const fetchSearchMember = useCallback(
        (nickname: string) => {
            fetchMore({
                variables: {
                    nickname,
                    first: NUM_PAGE,
                    after: null
                },
                updateQuery: (prevLoad, { fetchMoreResult }): MyTeamMemberType => {
                    return fetchMoreResult!
                },
            })
    }, [])

    return (
        <SectionCard width="550px">
            <SectionTitle>My Team Member List</SectionTitle>
            {loadingMoreMyTeamMember && <CustomSpinner />}
            {errorMoreMyTeamMember ? 
                <>
                    {errorMoreMyTeamMember.message}
                    <FailedText />
                </>
            :(
                <>
                    <Flex justify="center" mb={10}>
                        <Input
                            value={tentativeNidkname}
                            onChange={onChangeTentativeNickname}
                            borderColor="gray.500" w="300px"
                            borderRadius="1000px"
                            mr={3}
                            data-testid='search-member-form'
                        />
                        <PrimaryButton
                            name='search-member'
                            type="button"
                            disabled={false}
                            onClick={() => {
                                setNickname(tentativeNidkname)
                                fetchSearchMember(tentativeNidkname)
                                setIsSearchMode(true)
                        }}>
                            検索
                        </PrimaryButton>
                    </Flex>
                    {isSearchMode && (
                        <Box textAlign="center" mb={10}>
                            <FetchMoreLink
                                name='my-team-all-member'
                                onClick={() => {
                                    fetchFirstMember()
                                    setIsSearchMode(false)
                                    setTentativeNickname("")
                                    setNickname("")
                                }}
                                text="全てのメンバーを表示"
                            />
                        </Box>
                    )}
                    <Box>
                        <Flex borderBottom="1px solid #718096" >
                            <Box w={{ base: "40px", md: "50px"}}></Box>
                            <Text>名前</Text>
                            <Text pl={{ base: "50px", md: "80px" }}>加入日</Text>
                            <Text pl={{ base: "55px", md: "90px"}}>達成回数</Text>
                        </Flex>
                        {dataMoreMyTeamMember?.myTeamMember.edges?.map((member) => (
                            <MyTeamMemberListItem member={member} />
                        ))}
                        {dataMoreMyTeamMember?.myTeamMember.edges?.length === 0 && (
                            <Text textAlign="center" mt={10}>該当するメンバーはいません。</Text>
                        )}
                        {dataMoreMyTeamMember?.myTeamMember.pageInfo.hasNextPage &&
                            <Box textAlign="center" mt={5}>
                                <FetchMoreLink
                                    name='my-team-member'
                                    onClick={fetchMoreMember}
                                    text="さらに10人のメンバーを表示"
                                />
                            </Box>
                        
                        }
                        {dataMoreMyTeamMember?.myTeamMember.edges?.length > 10 && (
                            <Box mt={5}>
                                <SectionCloseLink name='team-member' onClick={fetchFirstMember} />
                            </Box>
                        )}
                    </Box>
                </>
            )}
        </SectionCard>
    )
})