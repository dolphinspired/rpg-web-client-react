import { CommandController } from './controller';
import { CommandArgs } from './args';

export type CommandHandlerFunction = (args: CommandArgs) => void;

export type CommandHandlerOptions = {
}

export function Command(cmd?: string, options?: CommandHandlerOptions) {
  return (target: CommandController, propertyKey: string, descriptor: TypedPropertyDescriptor<CommandHandlerFunction>) => {
    target.addHandler(propertyKey, cmd, options);
  }
}
