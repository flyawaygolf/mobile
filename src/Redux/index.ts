import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { combineReducers } from 'redux';

// Importe les réducteurs à partir de différents fichiers
import { postBookmarksReducer } from './Bookmarks';
import { exploreRecentTrendsReducer } from './exploreRecentTrends';
import { exploreTopTrendsReducer } from './exploreTopTrends';
import { exploreTopUsersReducer } from './exploreTopUsers';
import { exploreTopWorldTrendsReducer } from './exploreTopWorldTrends';
import { exploreWorldRecentTrendsReducer } from './exploreWorldRecentTrends';
import { golfsPlayedReducer } from './GolfsPlayed';
import { guildListReducer } from './guildList';
import { guildMessagesReducer } from './guildMessages';
import { mainFeedReducer } from './mainFeed';
import { notificationFeedReducer } from './NotificationFeed';
import { postSearchReducer } from './PostSearch';
import { postSharesReducer } from './PostShares';
import { postTempSaveFeedReducer } from './postTempSaveFeed';
import { profileFeedReducer } from './profileFeed';
import { recentMainFeedReducer } from './recentMainFeed';
import { userScorecardsReducer } from './UserScoreCard';

// Combine les réducteurs en un seul objet de réducteur
const rootReducer = combineReducers({
  // Associe chaque réducteur à une clé dans l'état de l'application
  mainFeed: mainFeedReducer,
  recentMainFeed: recentMainFeedReducer,
  postSearch: postSearchReducer,
  postShares: postSharesReducer,
  postBookmarks: postBookmarksReducer,
  exploreRecentTrends: exploreRecentTrendsReducer,
  exploreWorldRecentTrends: exploreWorldRecentTrendsReducer,
  exploreTopTrends: exploreTopTrendsReducer,
  exploreTopUsers: exploreTopUsersReducer,
  exploreTopWorldTrends: exploreTopWorldTrendsReducer,
  profileFeed: profileFeedReducer,
  postTempSaveFeed: postTempSaveFeedReducer,
  guildListFeed: guildListReducer,
  guildMessagesFeed: guildMessagesReducer,
  notificationFeed: notificationFeedReducer,
  golfsPlayed: golfsPlayedReducer,
  userScorecards: userScorecardsReducer
});

// Crée le magasin Redux en utilisant le réducteur combiné
export const store = configureStore({
  reducer: rootReducer
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector