namespace SWP391_BE.Middleware
{
    public class RoleMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly string _requiredRole;

        public RoleMiddleware(RequestDelegate next, string requiredRole)
        {
            _next = next;
            _requiredRole = requiredRole;
        }

        public async Task Invoke(HttpContext context)
        {
            var userRole = context.Items["UserRole"]?.ToString();

            if (userRole == null || (userRole != _requiredRole && _requiredRole != "All"))
            {
                context.Response.StatusCode = StatusCodes.Status403Forbidden;
                await context.Response.WriteAsync("Bạn không có quyền truy cập!");
                return;
            }

            await _next(context);
        }
    }
}
