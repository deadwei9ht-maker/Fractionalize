import { EventEmitter } from 'events';
import { FirestorePermissionError } from './errors';

type Events = {
  'permission-error': (error: FirestorePermissionError) => void;
};

// We can't use the generic EventEmitter type because it doesn't
// have the strict typing we need.
class TypedEventEmitter {
  private emitter = new EventEmitter();

  on<T extends keyof Events>(event: T, listener: Events[T]) {
    this.emitter.on(event, listener);
  }

  off<T extends keyof Events>(event: T, listener: Events[T]) {
    this.emitter.off(event, listener);
  }

  emit<T extends keyof Events>(
    event: T,
    ...args: Parameters<Events[T]>
  ) {
    this.emitter.emit(event, ...args);
  }
}

export const errorEmitter = new TypedEventEmitter();
