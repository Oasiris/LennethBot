export type FullCommand = {
  effect: any
  description: string
  unlisted?: boolean
  options?: object[]
  aliases?: string[]

  // Arguments for the command.
  params?: CommandParams
}

export type SimpleCommand = any

export type Command = FullCommand | SimpleCommand

export type CommandBank = {
  [key: string]: Command
}

export type CommandParams = Array<(
  [number, string]
  | [number, string, boolean]
  | [number, string, boolean, string]
  )>
