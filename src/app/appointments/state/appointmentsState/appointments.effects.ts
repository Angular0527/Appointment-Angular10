import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { from,switchMap,map,mergeMap, withLatestFrom } from "rxjs";
import { ScheduleService } from "../../schedule/schedule.service";
import { AppState } from "../app.state";
import * as AppointmentsActions from "./appointments.actions"
import {deleteAppointmentSuccess, loadAppointmentsSucces, updateAppointmentSuccess} from "./appointments.actions"
import {createAppoitmentSuccces} from "./appointments.actions"
import { selectAllApointments } from "./appointments.selectors";



@Injectable()
export class AppointmentsEffects {
  constructor(private actions$: Actions, private store: Store<AppState>, private scheduleService: ScheduleService) {}

loadAppointemnts$ = createEffect(() => {
  return this.actions$.pipe(
    ofType(AppointmentsActions.loadAppointments),
    withLatestFrom(this.store.select(selectAllApointments())),
    mergeMap(() => {
      return this.scheduleService.getAppointments().pipe(
        map((data) => {
          console.log(data)
        return loadAppointmentsSucces({ data })
        }
       )
      );
    })
  );
})


createAppointment$ = createEffect(() => {
  return this.actions$.pipe(
    ofType(AppointmentsActions.createAppoitment),
    withLatestFrom(this.store.select(selectAllApointments())),
    mergeMap((data) => {
      let obj = data[0]
      let { type, ...newObject } = { ...obj };
      return this.scheduleService.saveAppointment(newObject).pipe((
        map((data) => {
          const name = data.name;
          const newDataSet : any = {...obj, [name] : newObject};
          return  createAppoitmentSuccces( newDataSet)
        }
       )
      ));
    }
    )
  )
})

deleteAppointemnt$ = createEffect(() => {
  return this.actions$.pipe(
    ofType(AppointmentsActions.deleteAppointment),
    withLatestFrom(this.store.select(selectAllApointments())),
    switchMap((data) => {
      let entry = data[0].data
      return this.scheduleService.deleteAppointment(entry).pipe((
        map(() => {
          return deleteAppointmentSuccess({data: entry})
        })
      ))
    })
  )
})


updateAppointemnt$ = createEffect(() => {
  return this.actions$.pipe(
    ofType(AppointmentsActions.updateAppointment),
    withLatestFrom(this.store.select(selectAllApointments())),
    switchMap((data) => {
      let id = data[0].id
      let updatedObject = data[0].data
      return this.scheduleService.updateAppointment(updatedObject,id).pipe((
        map(() => {
          return updateAppointmentSuccess({id: id, data: updatedObject})
        })
      ))
    })
  )
})

}
