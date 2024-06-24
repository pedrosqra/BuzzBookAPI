export function buildResponse(
  statusCode: number,
  message: string,
  data?: any
) {
  return {
    statusCode,
    message,
    data
  };
}
