type ClassValue = string | undefined | null | false;
type ClassObject = Record<string, boolean>;
type ClassArg = ClassValue | ClassObject | ClassArg[];

export function cn(...args: ClassArg[]): string {
  const classes: string[] = [];

  const process = (arg: ClassArg) => {
    if (!arg) return;

    if (typeof arg === 'string') {
      classes.push(arg);
    } else if (Array.isArray(arg)) {
      arg.forEach(process);
    } else if (typeof arg === 'object') {
      Object.entries(arg).forEach(([key, value]) => {
        if (value) classes.push(key);
      });
    }
  };

  args.forEach(process);
  return classes.join(' ');
}
