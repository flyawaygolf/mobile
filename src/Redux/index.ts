import { combineReducers } from 'redux';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { configureStore } from "@reduxjs/toolkit";

// Importe les réducteurs à partir de différents fichiers
import { mainFeedReducer } from './mainFeed';
import { exploreRecentTrendsReducer } from './exploreRecentTrends';
import { exploreWorldRecentTrendsReducer } from './exploreWorldRecentTrends';
import { exploreTopTrendsReducer } from './exploreTopTrends';
import { exploreTopWorldTrendsReducer } from './exploreTopWorldTrends';
import { profileFeedReducer } from './profileFeed';
import { postSearchReducer } from './PostSearch';
import { postTempSaveFeedReducer } from './postTempSaveFeed';
import { guildListReducer } from './guildList';
import { guildMessagesReducer } from './guildMessages';
import { notificationFeedReducer } from './NotificationFeed';
import { postSharesReducer } from './PostShares';
import { postBookmarksReducer } from './Bookmarks';
import { exploreTopUsersReducer } from './exploreTopUsers';
import { recentMainFeedReducer } from './recentMainFeed';
import { golfsPlayedReducer } from './GolfsPlayed';

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
  golfsPlayed: golfsPlayedReducer
});

// Crée le magasin Redux en utilisant le réducteur combiné
export const store = configureStore({
  reducer: rootReducer
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector