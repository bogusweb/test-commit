import { isObservable, from, of, Observable } from 'rxjs';

export function isFunction(val: any): val is Function {
  return typeof val === 'function';
}

export function isPromise(v: any) {
  return v && isFunction(v.then);
}

export function observify<T>(asyncOrValue: any | T): Observable<T> {
  if (isPromise(asyncOrValue) || isObservable(asyncOrValue)) {
    return from(asyncOrValue) as Observable<T>;
  }

  return of(asyncOrValue);
}
