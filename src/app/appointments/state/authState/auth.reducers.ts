import { createFeature, on, createReducer } from "@ngrx/store";
import * as AuthActions from "./auth.actions"



export interface AuthState {
    token: string
    errorMessage: string;
    status:'pending' | 'loading' | 'error' | 'successs'
}

export const initialState: AuthState =  {
  token:'',
  errorMessage:'',
  status:'pending'
}


export const authReducer = createFeature({
  name: 'auth',
  reducer: createReducer(
    initialState,
    on(AuthActions.loginUser,(state: any) => ({...state,status:'loading'})),
    on(AuthActions.loginUserSuccess,(state) => ({
      ...state,
      token:'',
      status:'successs'
    })),
    on(AuthActions.loginUserFailed,(state,error) => ({
      ...state,
      token: '',
      error:error.errorMessage,
      status:'error'
    })),
    on(AuthActions.registerUser,(state: any) =>({...state,status:'loading'})),
    on(AuthActions.registerUserSuccess,(state) => ({
      ...state,
      status:'successs'
    })),
    on(AuthActions.registerUserFailed,(state,error) => ({
      ...state,
      token: '',
      error:error.errorMessage,
      status:'error'
    }))
  )
});
