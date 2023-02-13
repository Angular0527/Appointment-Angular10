import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AppState } from "../app.state";
import { AuthState } from "./auth.reducers"



export const selectAuth = createFeatureSelector<AuthState>('auth');

export const selectAuthToken = ()  => createSelector(
  selectAuth,
  (state: AuthState) => state.token
)

export const selectAuthStatus = ()  => createSelector(
  selectAuth,
  (state: AuthState) => state.status
)


export const selectAuthErrorMessage = ()  => createSelector(
  selectAuth,
  (state: AuthState) => state.errorMessage
)
