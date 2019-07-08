export type FullCommand = {
  effect: any
  description: string
  unlisted?: boolean
  options?: object[]
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