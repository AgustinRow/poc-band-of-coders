export function startUpLog (...items: any[]): void {
  if (process.env.OMIT_STARTUP_LOG === 'true') return
  console.log(...items)
}
