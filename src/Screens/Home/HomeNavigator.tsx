import React, { memo } from 'react';
import FollowsTrends from './FollowsTrends';
import { ScreenWrapper } from '../../Components/Container';

function HomeNavigator() {

  return (
    <ScreenWrapper>
      <FollowsTrends />
    </ScreenWrapper>
  )
}

export default memo(HomeNavigator);