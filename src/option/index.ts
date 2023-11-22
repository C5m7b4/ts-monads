export const OptionType = {
  Some: Symbol(':some'),
  None: Symbol(':none'),
};

export interface Match<T, U> {
  some: (val: T) => U;
  none: (() => U) | U;
}

export interface Option<T> {
  type: symbol;
  match<U>(fn: Match<T, U>): U;
  map<U>(fn: (val: T) => U): Option<U>;
  isSome(): boolean;
  isNone(): boolean;
  unwrapOr(def: T): T;
  unwrap(): T | never;
  andThen<U>(fn: (val: T) => Option<U>): Option<U>;
  or<U>(optb: Option<U>): Option<T | U>;
  and<U>(optb: Option<U>): Option<U>;
}

export interface OptSome<T> extends Option<T> {
  map<U>(fn: (val: T) => U): OptSome<U>;
}

export interface OptNone<T> extends Option<T> {
  map<U>(fn: (val: T) => U): OptNone<U>;
}

export function Some<T>(val?: T | undefined): Option<T> {
  return typeof val === 'undefined' ? none_constructor<T>() : some_constructor<T>(val as T);
}

export const None = none_constructor<any>();

function some_constructor<T>(val: T): OptSome<T> {
  return {
    type: OptionType.Some,
    match<U>(fn: Match<T, U>): U {
      return fn.some(val);
    },
    map<U>(fn: (val: T) => U): OptSome<U> {
      return some_constructor<U>(fn(val));
    },
    isSome(): boolean {
      return true;
    },
    isNone(): boolean {
      return false;
    },
    unwrapOr(_def: T): T {
      return val;
    },
    unwrap(): T {
      return val;
    },
    andThen<U>(fn: (val: T) => Option<U>): Option<U> {
      return fn(val);
    },
    or<U>(_optb: Option<U>): Option<T> {
      return this;
    },
    and<U>(optb: Option<U>): Option<U> {
      return optb;
    },
  };
}

function none_constructor<T>(): OptNone<T> {
  return {
    type: OptionType.None,
    match<U>(matchObject: Match<T, U>): U {
      const { none } = matchObject;
      if (typeof none === 'function') {
        return (none as () => U)();
      }
      return none;
    },
    map<U>(_fn: (val: T) => U): OptNone<U> {
      return none_constructor<U>();
    },
    isSome(): boolean {
      return false;
    },
    isNone(): boolean {
      return true;
    },
    unwrapOr(def: T): T {
      if (def === null) {
        throw new Error('Cannot call unwrapOf with a missing value');
      }
      return def;
    },
    unwrap(): never {
      throw new ReferenceError('trying to unwrap a none');
    },
    andThen<U>(_fn: (val: T) => Option<U>): OptNone<U> {
      return none_constructor<U>();
    },
    or<U>(optb: Option<U>): Option<U> {
      return optb;
    },
    and<U>(_optb: Option<U>): Option<U> {
      return none_constructor<U>();
    },
  };
}
export function IsSome<T>(val: Option<T>): val is OptSome<T> {
  return val.isSome();
}

export function isNone<T>(val: Option<T>): val is OptNone<T> {
  return val.isNone();
}
