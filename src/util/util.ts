/**
 * @resolves after the specified number of milliseconds.
 */
export function sleep(millis: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, millis))
}
