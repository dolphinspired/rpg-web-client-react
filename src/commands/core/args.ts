export type CommandArgs = {
  cmd: string;
  positional: string[];
  named: { [key: string]: any };
}