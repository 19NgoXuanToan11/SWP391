using Data.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Repo;
using Service;
using SWP391_BE.Mappings;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Register SkinCareManagementDbContext
builder.Services.AddDbContext<SkinCareManagementDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("SkinCareManagementDB")));

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add these lines in the service registration section
builder.Services.AddScoped<IOrderRepository, OrderRepository>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddAutoMapper(typeof(OrderMappingProfile));

// Add these lines along with the other service registrations
builder.Services.AddScoped<IOrderDetailRepository, OrderDetailRepository>();
builder.Services.AddScoped<IOrderDetailService, OrderDetailService>();
builder.Services.AddAutoMapper(typeof(OrderDetailMappingProfile));

// Add these lines along with the other service registrations
builder.Services.AddScoped<IPromotionRepository, PromotionRepository>();
builder.Services.AddScoped<IPromotionService, PromotionService>();
builder.Services.AddAutoMapper(typeof(PromotionMappingProfile));

// Add these lines along with the other service registrations
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddAutoMapper(typeof(ProductMappingProfile));

// Add these lines along with the other service registrations
builder.Services.AddScoped<ISkintypeRepository, SkintypeRepository>();
builder.Services.AddScoped<ISkintypeService, SkintypeService>();
builder.Services.AddAutoMapper(typeof(SkintypeMappingProfile));

// Add these lines along with the other service registrations
builder.Services.AddScoped<ISkinRoutineRepository, SkinRoutineRepository>();
builder.Services.AddScoped<ISkinRoutineService, SkinRoutineService>();
builder.Services.AddAutoMapper(typeof(SkinRoutineMappingProfile));

<<<<<<< Updated upstream
// Register Payment related services
builder.Services.AddScoped<IPaymentRepository, PaymentRepository>();
builder.Services.AddScoped<IPaymentService, PaymentService>();
/*builder.Services.AddHttpClient<IPayosService, PayosService>(client =>
{
    client.BaseAddress = new Uri("https://api-merchant.payos.vn/");
    client.DefaultRequestHeaders.Add("x-client-id", builder.Configuration["Payos:ClientId"] ?? throw new ArgumentNullException("Payos:ClientId"));
    client.DefaultRequestHeaders.Add("x-api-key", builder.Configuration["Payos:ApiKey"] ?? throw new ArgumentNullException("Payos:ApiKey"));
    client.Timeout = TimeSpan.FromSeconds(30);
});*/

// Register additional services
builder.Services.AddScoped<IDashboardReportRepository, DashboardReportRepository>();
builder.Services.AddScoped<IDashboardReportService, DashboardReportService>();
builder.Services.AddAutoMapper(typeof(DashboardMappingProfile));

=======
>>>>>>> Stashed changes
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddAutoMapper(typeof(Program).Assembly);

builder.Services.AddCors(options =>
{
<<<<<<< Updated upstream
    options.AddPolicy("AllowFrontend",
        builder => builder
            .WithOrigins(
                "http://localhost:5173", // FE local
                "https://swp-391-pink.vercel.app", // FE deployed
                "https://api-sandbox.payos.vn",
                "https://0604-27-78-79-30.ngrok-free.app" // Thêm ngrok URL mới vào đây mỗi lần restart
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials());
=======
    options.AddPolicy("AllowAll",
        builder =>
        {
            builder.AllowAnyOrigin()
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
>>>>>>> Stashed changes
});
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {

            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8
                .GetBytes(builder.Configuration.GetSection("AppSettings:Token").Value!)),
            ValidateIssuer = false,
            ValidateAudience = false
        };
    });

builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

<<<<<<< Updated upstream
// Remove UseHttpsRedirection if testing with HTTP
// app.UseHttpsRedirection();

app.UseCors("AllowFrontend");
=======
app.UseHttpsRedirection();
>>>>>>> Stashed changes
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
