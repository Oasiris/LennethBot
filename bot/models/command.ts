export type FullCommand = {
  description: string;
  options?: object[];
  effect: any;
  aliases?: string[];
}