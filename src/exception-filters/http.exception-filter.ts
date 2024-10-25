import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch() 
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR; 
    let errorMessage = 'Internal server error'; 
    let errorDetails: string | null = null;

    if (exception.code === 'ENOENT') {
      status = HttpStatus.NOT_FOUND; 
      errorMessage = 'File or directory not found';
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      errorMessage = exception.message || 'An error occurred';

      // Safely access getResponse() only if exception is an HttpException
      const exceptionResponse = exception.getResponse();
      if (typeof exceptionResponse === 'object' && 'message' in exceptionResponse) {
        errorDetails = (exceptionResponse as any).message;
      }
    } else {
      // For non-HttpException errors (like native JS errors)
      errorMessage = exception.message || errorMessage;
    }

    this.logger.error(`${request.method} ${request.originalUrl} ${status} error: ${errorMessage}`);
    
    response.status(status).json({
      statusCode: status,
      error: true,
      message: errorMessage,
      timestamp: new Date().toISOString(),
      path: request.url,
      errorDetails
    });
  }
}
