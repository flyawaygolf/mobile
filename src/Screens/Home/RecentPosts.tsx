import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RefreshControl } from 'react-native';
import { useTranslation } from 'react-i18next';
import { FlashList } from '@shopify/flash-list';

import { useClient, useTheme } from '../../Components/Container';
import DisplayPosts from '../../Components/Posts/DisplayPost';
import { Loader } from '../../Other';
import { RootState, useAppDispatch, useAppSelector } from '../../Redux';

import { PostInterface } from '../../Services/Client/Managers/Interfaces';
import EmptyHome from '../../Components/Home/EmptyHome';
import { addRecentMainPosts, initRecentMainPosts } from '../../Redux/recentMainFeed/action';
import { ON_END_REACHED_THRESHOLD_POSTS } from '../../Services/constante';

const RecentPosts = () => {

  const posts = useAppSelector((state) => state.recentMainFeed);
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
    const response = await client.explore.recentTrends({
      translateTo: i18n.language,
      locale: "all"
    });
    if (refresh) setLoaderF(false)
    else setLoader(false)
    if (response.error || !response.data) return;
    dispatch(initRecentMainPosts(response.data));
    if (response.pagination_key) setPaginationKey(response.pagination_key);
  }

  async function start() {
    getData()
  }

  useEffect(() => {
    start()
  }, [])

  const onEndReached = async () => {
    setLoader(true)
    if (loader) return;
    const response = await client.explore.recentTrends({ pagination_key: pagination_key, locale: "all", translateTo: i18n.language });
    setLoader(false);
    if (response.error || !response.data) return;
    if (response.data.length < 1) return;
    if (response.pagination_key) setPaginationKey(response.pagination_key);
    dispatch(addRecentMainPosts(response.data));
  }

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
    recentMainFeed: state.recentMainFeed
  };
};

const mapDispatchToProps = {
  addRecentMainPosts,
  initRecentMainPosts
};

export default connect(mapStateToProps, mapDispatchToProps)(RecentPosts);