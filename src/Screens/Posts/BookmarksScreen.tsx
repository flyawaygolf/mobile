import { FlashList } from '@shopify/flash-list';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native-paper';
import { connect } from 'react-redux';

import { PostContainer, useClient } from '../../Components/Container';
import DisplayPosts from '../../Components/Posts/DisplayPost';
import { Loader } from '../../Other';
import { RootState, useAppDispatch, useAppSelector } from '../../Redux';
import { addPostBookmarks, initPostBookmarks } from '../../Redux/Bookmarks/action';
import { PostInterface } from '../../Services/Client/Managers/Interfaces';

function Bookmarks({ route }: any) {

    const { client } = useClient();
    const { t, i18n } = useTranslation();
    const { target_id } = route.params;
    const posts = useAppSelector((state) => state.postBookmarks);
    const dispatch = useAppDispatch();
    const [loader, setLoader] = useState(true);
    const [pagination_key, setPaginationKey] = useState<string | undefined>(undefined);
    
    async function getData() {
        const response = await client.posts.getSavedPost(target_id, i18n.language);
        setLoader(false)
        if(response.error || !response.data) return;
        if(response.data.length < 1) return;        
        if(response.pagination_key) setPaginationKey(response.pagination_key);
        dispatch(initPostBookmarks(response.data));
    }

    useEffect(() => {
        dispatch(initPostBookmarks([]));
        getData()
    }, [target_id])
    
    const bottomHandler = async () => {
        if(loader) return;
        setLoader(true)        
        const response = await client.posts.getSavedPost(target_id, i18n.language, { pagination_key: pagination_key });
        setLoader(false);
        if(response.error || !response.data) return;
        if(response.data.length < 1) return;
        if(response.pagination_key) setPaginationKey(response.pagination_key);
        dispatch(addPostBookmarks(response.data));
    }

    const renderItem = ({ item }: { item: PostInterface.postResponseSchema }) => (
        <DisplayPosts comments={false} informations={item} />
    )

    const memoizedValue = useMemo(() => renderItem, [posts]);

    return (
        <PostContainer title="posts.bookmarks">
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
    addPostBookmarks,
    initPostBookmarks
};
  
export default connect(mapStateToProps, mapDispatchToProps)(Bookmarks);