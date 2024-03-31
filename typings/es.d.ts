declare global {
  interface ArrayConstructor {
    isArray<T = unknown>(arg: unknown): arg is T[] | ReadonlyArray<T>;
  }
}

export {};
