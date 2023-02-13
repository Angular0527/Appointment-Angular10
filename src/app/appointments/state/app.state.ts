import { AppointmentsState } from "./appointmentsState/appointments.reducers";
import { AuthState } from "./authState/auth.reducers";


export interface AppState {
  appointments : AppointmentsState
  auth: AuthState
}
