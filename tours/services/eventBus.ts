type Callback = (...args: any[]) => void;

const listeners: Record<string, Set<Callback>> = {};

export function on(event: string, cb: Callback) {
  if (!listeners[event]) listeners[event] = new Set();
  listeners[event].add(cb);
  return () => off(event, cb);
}

export function off(event: string, cb: Callback) {
  if (!listeners[event]) return;
  listeners[event].delete(cb);
}

export function emit(event: string, ...args: any[]) {
  if (!listeners[event]) return;
  for (const cb of Array.from(listeners[event])) {
    try { cb(...args); } catch (e) { console.warn('eventBus handler error', e); }
  }
}

export default { on, off, emit };
