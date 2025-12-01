export function to_int(value: unknown): number | undefined {
  if (typeof value === "string") {
    if (value.trim() === "") {
      return undefined;
    }
    const val = parseInt(value, 10);
    if (!Number.isNaN(val)) {
      return val;
    }
  }
  if (typeof value === "number" && !Number.isNaN(value)) {
    return Math.floor(value);
  }
  return undefined;
}

export function to_number(value: unknown): number | undefined {
  if (typeof value === "string") {
    if (value.trim() === "") {
      return undefined;
    }
    const val = Number(value);
    if (!Number.isNaN(val)) {
      return val;
    }
  }
  if (typeof value === "number" && !Number.isNaN(value)) {
    return value;
  }
  return undefined;
}

export function to_float(value: unknown): number | undefined {
  if (typeof value === "string") {
    if (value.trim() === "") {
      return undefined;
    }
    const val = parseFloat(value);
    if (!Number.isNaN(val)) {
      return val;
    }
  }

  if (typeof value === "number" && !Number.isNaN(value)) {
    return value;
  }
  return undefined;
}

export function to_boolean(value: unknown, fallbackValue: boolean): boolean {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    const value_lower_case = value.toLowerCase();
    if (value_lower_case === "true" || value_lower_case === "1") {
      return true;
    }

    if (value_lower_case === "false" || value_lower_case === "0") {
      return false;
    }
  }

  return fallbackValue;
}

export function is_not_null_or_undefined<T>(input: null | undefined | T): input is T {
  return input !== null && input !== undefined;
}
