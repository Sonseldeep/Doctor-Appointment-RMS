namespace DoctorAppointmentSystem.Api.Common.Exceptions;

public abstract class AppException(string message, int statusCode) : Exception(message)
{
    public int StatusCode { get; } = statusCode;
}

// 400: Bad Request
public class BadRequestException(string message) : AppException(message, StatusCodes.Status400BadRequest);

// 401: Unauthorized
public class UnauthorizedException(string message) : AppException(message, StatusCodes.Status401Unauthorized);

// 403: Forbidden
public class ForbiddenException(string message) : AppException(message, StatusCodes.Status403Forbidden);

// 404: Not Found
public class NotFoundException(string message) : AppException(message, StatusCodes.Status404NotFound);

// 405: Method Not Allowed
public class MethodNotAllowedException(string message) : AppException(message, StatusCodes.Status405MethodNotAllowed);

// 409: Conflict
public class ConflictException(string message) : AppException(message, StatusCodes.Status409Conflict);

// 422: Unprocessable Entity
public class UnprocessableEntityException(string message)
    : AppException(message, StatusCodes.Status422UnprocessableEntity);

// 429: Too Many Requests
public class TooManyRequestsException(string message) : AppException(message, StatusCodes.Status429TooManyRequests);

// 500: Internal Server Error
public class InternalServerErrorException(string message)
    : AppException(message, StatusCodes.Status500InternalServerError);

// 503: Service Unavailable
public class ServiceUnavailableException(string message)
    : AppException(message, StatusCodes.Status503ServiceUnavailable);

public class AppInvalidOperationException(string message)
    : AppException(message, StatusCodes.Status500InternalServerError);