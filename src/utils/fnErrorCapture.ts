/**
 * Wrap a function in a try block which
 * captures an error stack trace leading up to the call,
 * and then ignores anything after.
 */
export default function fnErrorCapture<T extends (...args: any[]) => any>(
  fn: T
): (...args: Parameters<T>) => ReturnType<T> {
  return function captureFn(...args: Parameters<T>) {
    try {
      return fn(...args);
    } catch (error) {
      if (error instanceof Error) Error.captureStackTrace(error, captureFn);
      throw error;
    }
  };
}
