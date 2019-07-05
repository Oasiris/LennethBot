export type FullCommand = {
  description: string
  options?: object[]
  effect: any
  aliases?: string[]

  // Arguments for the command.
  params?: CommandParams
}

export type CommandParams = 
  (
    [number, string] 
  | [number, string, boolean]
  | [number, string, boolean, string]
  )[]