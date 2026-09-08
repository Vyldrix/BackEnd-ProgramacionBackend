export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Recurso no encontrado") {
    super(message, 404);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = "Solicitud incorrecta") {
    super(message, 400);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = "Conflicto en la solicitud") {
    super(message, 409);
  }
}

export class InsufficientStockError extends AppError {
  constructor(message: string = "Stock insuficiente para completar la operación") {
    super(message, 400);
  }
}
