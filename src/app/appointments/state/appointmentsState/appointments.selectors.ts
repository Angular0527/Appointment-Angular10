import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AppState } from "../app.state";
import { AppointmentsState } from "./appointments.reducers";



export const selectAppointments = createFeatureSelector<AppointmentsState>('appoitments');

export const selectAllApointments = ()  => createSelector(
  selectAppointments,
  (state: AppointmentsState) => state.appointments
)
