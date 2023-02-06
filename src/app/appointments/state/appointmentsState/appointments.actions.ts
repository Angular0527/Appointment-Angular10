import { createAction, props } from "@ngrx/store";
import { AppointmentServiceObject } from "src/app/appointment-service-object";



export const createAppoitment = createAction(
  'Create appointment',
  props<{data: any}>()
)

export const createAppoitmentSuccces = createAction(
  'Create appointment Success',
  props<{data: AppointmentServiceObject}>()
)

export const deleteAppointment = createAction(
  'Delete appointment',
  props<{data: string}>()
)
export const deleteAppointmentSuccess = createAction(
  'Delete appointments success',
  props<{data: string}>()
)

export const updateAppointment = createAction(
  'Update appointment',
  props<{id:String,
        data: Object}>()
)

export const updateAppointmentSuccess = createAction(
  'Update appointment success',
  props<{id:String,
        data: Object}>()
)

export const loadAppointments = createAction(
  'Get all apointments'
)

export const loadAppointmentsSucces = createAction(
  'Load Success appointments',
  props<{data: AppointmentServiceObject}>()
)



