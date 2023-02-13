import { createAction,props } from "@ngrx/store"


export const registerUser = createAction(
  'Register User',
  props<{email: string , password: string}>()
)

export const registerUserSuccess = createAction(
  'Register user success',
)

export const registerUserFailed = createAction(
  'Register user failed',
  props<{errorMessage: any}>()
)


export const loginUser = createAction(
  'Login User',
  props<{email: string , password: string}>()
)

export const loginUserSuccess = createAction(
  'Login User Success',

)


export const loginUserFailed = createAction(
  'Login User Failed',
  props<{errorMessage: string}>()
)

export const logoutUser = createAction(
  'Logout User',
)
