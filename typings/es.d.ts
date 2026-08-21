declare global {
  interface ArrayConstructor {
    isArray<T = unknown>(argument: unknown): argument is T[] | ReadonlyArray<T>;
  }
}

export {};
