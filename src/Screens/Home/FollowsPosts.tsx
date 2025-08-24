import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RefreshControl } from 'react-native';
import { FlashList } from "@shopify/flash-list";
import { useTranslation } from 'react-i18next';

import { useClient, useTheme } from '../../Components/Container';
import DisplayPosts from '../../Components/Posts/DisplayPost';
import { addMainTrends, initMainTrends } from '../../Redux/mainFeed/action';
import { Loader } from '../../Other';
import { RootState, useAppDispatch, useAppSelector } from '../../Redux';

import { PostInterface } from '../../Services/Client/Managers/Interfaces';
import EmptyHome from '../../Components/Home/EmptyHome';
import { ON_END_REACHED_THRESHOLD_POSTS } from '../../Services/constante';

const FollowsPosts = () => {

  const posts = useAppSelector((state) => state.mainFeed);
  const dispatch = useAppDispatch();
  const [pagination_key, setPaginationKey] = useState<string | undefined>(undefined);
  const [loader, setLoader] = useState(true);
  const [loaderF, setLoaderF] = useState(false);
  const { colors } = useTheme();
  const { client } = useClient();
  const { i18n } = useTranslation();

  async function getData(refresh: boolean = false) {
    if (refresh) {
      setLoaderF(true)
      if (loaderF) return;
    }
    const response = await client.posts.fetch(i18n.language);
    if (refresh) setLoaderF(false)
    else setLoader(false)
    if (response.error || !response.data) return;
    dispatch(initMainTrends(response.data));
    if (response.pagination_key) setPaginationKey(response.pagination_key);
  }

  async function start() {
    getData()
  }

  useEffect(() => {
    start()
  }, [])

  const onEndReached = async () => {
    if (!loader && pagination_key) {
      setLoader(true);
      const response = await client.posts.fetch(i18n.language, { pagination_key });
      if (response.data?.length) {
        dispatch(addMainTrends(response.data));
        setPaginationKey(response.pagination_key);
      }
      setLoader(false);
    }
  };

  const MemoizedDisplayPosts = React.memo(
    DisplayPosts,
    (prev, next) =>
      prev.informations.post_id === next.informations.post_id &&
      prev.informations.created_at === next.informations.created_at
  );

  const renderItem = useCallback(({ item }: { item: PostInterface.postResponseSchema }) => (
    <MemoizedDisplayPosts
      key={`${item.post_id}-${item.created_at}`}
      comments={false}
      informations={item}
    />
  ), []);

  return (
    <FlashList
      onEndReached={onEndReached}
      onEndReachedThreshold={ON_END_REACHED_THRESHOLD_POSTS}
      data={posts}
      refreshing={loaderF}
      keyExtractor={item => `${item.post_id}-${item.created_at}`}
      renderItem={renderItem}
      ListFooterComponent={loader ? <Loader /> : undefined}
      ListEmptyComponent={<EmptyHome />}
      refreshControl={<RefreshControl
        refreshing={loaderF}
        progressBackgroundColor={colors.bg_primary}
        tintColor={colors.fa_primary}
        colors={[colors.fa_primary, colors.fa_secondary, colors.fa_third]}
        onRefresh={() => getData(true)} />
      }
    />
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    mainFeed: state.mainFeed
  };
};

const mapDispatchToProps = {
  addMainTrends,
  initMainTrends
};

export default connect(mapStateToProps, mapDispatchToProps)(FollowsPosts);