export class WorkflowError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'WorkflowError';
  }
}

export class AgentError extends Error {
  constructor(
    message: string,
    public agentId: string,
    public details?: any
  ) {
    super(message);
    this.name = 'AgentError';
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public field: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function handleApiError(error: unknown): {
  message: string;
  code: string;
  status: number;
} {
  if (error instanceof WorkflowError) {
    return {
      message: error.message,
      code: error.code,
      status: 400,
    };
  }

  if (error instanceof AgentError) {
    return {
      message: error.message,
      code: 'AGENT_ERROR',
      status: 500,
    };
  }

  if (error instanceof ValidationError) {
    return {
      message: error.message,
      code: 'VALIDATION_ERROR',
      status: 400,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      code: 'INTERNAL_ERROR',
      status: 500,
    };
  }

  return {
    message: 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR',
    status: 500,
  };
}

export function isApiError(error: unknown): error is { message: string; code: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    'code' in error
  );
}
