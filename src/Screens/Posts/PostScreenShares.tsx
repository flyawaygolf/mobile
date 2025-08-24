import React, { useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { PostContainer, useClient } from '../../Components/Container';
import DisplayPosts from '../../Components/Posts/DisplayPost';
import { addPostShares, initPostShares } from '../../Redux/PostShares/action';
import { Loader } from '../../Other';
import { RootState, useAppDispatch, useAppSelector } from '../../Redux';
import { Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { PostInterface } from '../../Services/Client/Managers/Interfaces';
import { FlashList } from '@shopify/flash-list';

function PostScreenShares({ route }: any) {

    const { client } = useClient();
    const { t, i18n } = useTranslation();
    const { post_id } = route.params;
    const posts = useAppSelector((state) => state.postShares);
    const dispatch = useAppDispatch();
    const [loader, setLoader] = useState(true);
    const [pagination_key, setPaginationKey] = useState<string | undefined>(undefined);
    
    async function getData() {
        const response = await client.posts.shares(post_id, i18n.language);
        setLoader(false)
        if(response.error || !response.data) return;
        if(response.data.length < 1) return;        
        if(response.pagination_key) setPaginationKey(response.pagination_key);
        dispatch(initPostShares(response.data));
    }

    useEffect(() => {
        dispatch(initPostShares([]));
        getData()
    }, [post_id])
    
    const bottomHandler = async () => {
        if(loader) return;
        setLoader(true)        
        const response = await client.posts.shares(post_id, i18n.language, { pagination_key: pagination_key });
        if(response.error || !response.data) return;
        if(response.data.length < 1) return;
        if(response.pagination_key) setPaginationKey(response.pagination_key);
        dispatch(addPostShares(response.data));
        setLoader(false)
    }

    const renderItem = ({ item }: { item: PostInterface.postResponseSchema }) => (
        <DisplayPosts comments={false} informations={item} />
    )

    const memoizedValue = useMemo(() => renderItem, [posts]);

    return (
        <PostContainer title="posts.shares">
            <FlashList
                ListEmptyComponent={<Text style={{ padding: 5 }}>{t("commons.nothing_display")}</Text>}
                ListFooterComponent={loader ? <Loader /> : undefined}
                onScrollEndDrag={() => bottomHandler()}
                data={posts} 
                renderItem={memoizedValue}
                keyExtractor={item => item.post_id} /> 
        </PostContainer>
    )
}

const mapStateToProps = (state: RootState) => {
    return {
        postSearch: state.postShares,
    };
  };
  
const mapDispatchToProps = {
    addPostShares,
    initPostShares
};
  
export default connect(mapStateToProps, mapDispatchToProps)(PostScreenShares);