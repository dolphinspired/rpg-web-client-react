import { CommandHandlerOptions } from './command';
import { CommandService } from '../../services';

export type CommandHandlerInitializer = {
  method: string;
  cmd: string;
  options?: CommandHandlerOptions;
}

export abstract class CommandController {
  private handlers?: CommandHandlerInitializer[];

  public addHandler(method: string, cmd: string, options: CommandHandlerOptions) {
    if (!this.handlers) {
      this.handlers = [];
    }

    this.handlers.push({
      method: method,
      cmd: cmd || method,
      options: options || {}
    });
  }

  public initHandlers(svc: CommandService) {
    this.handlers.forEach(handler => {
      if (!handler.cmd) {
        console.log('[Warning] Handler has no cmd specified, it will not be registered');
        return;
      }

      if (handler.options) {
        // handle options here
      }

      svc.on(handler.cmd, async (msg) => {
        await (this as any)[handler.method](msg);
      });
    });
  }
}