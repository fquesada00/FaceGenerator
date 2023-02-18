class ApiError extends Error {
  private _title: string;

  private _detail: string;

  constructor(title: string, message: string) {
    super(message);
    this._title = title;
    this._detail = message;
  }

  get title() {
    return this._title;
  }

  get detail() {
    return this._detail;
  }

  toString() {
    return `${this._title}: ${this._detail}`;
  }
}

export const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  return String(error);
};

export default ApiError;
