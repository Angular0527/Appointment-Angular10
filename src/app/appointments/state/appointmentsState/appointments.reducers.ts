import { createFeature, createReducer,on } from "@ngrx/store";
import { AppointmentServiceObject } from "src/app/appointment-service-object";
import * as AppointmentsActions from "./appointments.actions"


export interface AppointmentsState {
    appointments: AppointmentServiceObject[]
    status:'pending' | 'loading' | 'error' | 'successs'
}

export const initialState: AppointmentsState =  {
  appointments:[],
  status:'pending'
}


export const appointmentReducer = createFeature({
  name: 'appoitments',
  reducer: createReducer(
    initialState,
    on(AppointmentsActions.loadAppointments, (state: any) => ({ ...state, status: 'loading' })),
    on(AppointmentsActions.loadAppointmentsSucces, (state, { data }) => ({
      ...state,
      appointments: [data],
      status: 'successs'
    })),
    on(AppointmentsActions.createAppoitment, (state: any) => ({ ...state, status: 'loading' })),
    on(AppointmentsActions.createAppoitmentSuccces,(state, data) => ({
      ...state,
      appointments:[{...state.appointments[0], ...data}]
    })),
    on(AppointmentsActions.deleteAppointment, (state: any) => ({ ...state, status: 'loading' })),
    on(AppointmentsActions.deleteAppointmentSuccess,(state, data) => {
      const removeProperty = (dyProps: string) => ({ [dyProps]: _, ...rest }) => rest
      const remove_deleted_entry = removeProperty(data.data)
      const newState : any = remove_deleted_entry(state.appointments[0])
     return {
      ...state,
      appointments:[newState]
     }
    }),
    on(AppointmentsActions.updateAppointment, (state: any) => ({ ...state, status: 'loading' })),
    on(AppointmentsActions.updateAppointmentSuccess,(state, data) => {
      const newState : any = [{...state.appointments[0]}]
      const keys = Object.keys(newState[0])
      keys.forEach((key) => {
        if(key === data.id) {
          newState[0][key] = data.data
        }
      })
     return {
      ...state,
      appointments:[newState[0]]
     }
    }),
  )
}

);
