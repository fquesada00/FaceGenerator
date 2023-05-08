class ApiError extends Error {
  private _title: string;

  private _detail: string;

  private _status: number | undefined;

  constructor(title: string, message: string, status?: number) {
    super(message);
    this._title = title;
    this._detail = message;
    this._status = status;
  }

  get title() {
    return this._title;
  }

  get detail() {
    return this._detail;
  }

  get status() {
    return this._status;
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
