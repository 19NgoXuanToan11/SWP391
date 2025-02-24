using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Data.Models;

public partial class SkinCareManagementDbContext : DbContext
{
    private readonly IConfiguration _configuration;

    public SkinCareManagementDbContext()
    {
    }

    public SkinCareManagementDbContext(DbContextOptions<SkinCareManagementDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Brand> Brands { get; set; }

    public virtual DbSet<Category> Categories { get; set; }

    public virtual DbSet<DashboardReport> DashboardReports { get; set; }

    public virtual DbSet<Feedback> Feedbacks { get; set; }

    public virtual DbSet<Order> Orders { get; set; }

    public virtual DbSet<OrderDetail> OrderDetails { get; set; }

    public virtual DbSet<Payment> Payments { get; set; }

    public virtual DbSet<PaymentHistory> PaymentHistories { get; set; }

    public virtual DbSet<Product> Products { get; set; }

    public virtual DbSet<ProductImage> ProductImages { get; set; }

    public virtual DbSet<Promotion> Promotions { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<SkinRoutine> SkinRoutines { get; set; }

    public virtual DbSet<Skintype> Skintypes { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<Volume> Volumes { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            IConfiguration config = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", true, true)
                .Build();

            var connectionString = config.GetConnectionString("SkinCareManagementDB");
            optionsBuilder.UseSqlServer(connectionString);
        }
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Brand>(entity =>
        {
            entity.ToTable("Brands");
            
            entity.HasKey(e => e.BrandId).HasName("PK__Brands__DAD4F3BE7F60ED59");
            entity.Property(e => e.BrandId).HasColumnName("BrandID");
            entity.Property(e => e.BrandName).HasMaxLength(100).IsRequired();
            entity.Property(e => e.Description).HasColumnType("nvarchar(max)");

            // Configure relationship with Products
            entity.HasMany(d => d.Products)
                .WithOne(p => p.Brand)
                .HasForeignKey(p => p.BrandId)
                .HasConstraintName("FK__Products__BrandI__123456");
        });

        modelBuilder.Entity<Category>(entity =>
        {
            entity.ToTable("Categories");
            
            entity.HasKey(e => e.CategoryId).HasName("PK__Categori__19093A0B7F60ED59");
            entity.Property(e => e.CategoryId).HasColumnName("CategoryID");
            entity.Property(e => e.CategoryName).HasMaxLength(100).IsRequired();
            entity.Property(e => e.Description).HasColumnType("nvarchar(max)");

            // Configure relationship with Products
            entity.HasMany(d => d.Products)
                .WithOne(p => p.Category)
                .HasForeignKey(p => p.CategoryId)
                .HasConstraintName("FK__Products__CategoryI__234567");
        });

        modelBuilder.Entity<Volume>(entity =>
        {
            entity.ToTable("Volumes");
            
            entity.HasKey(e => e.VolumeId).HasName("PK__Volumes__4CBC35B77F60ED59");
            entity.Property(e => e.VolumeId).HasColumnName("VolumeID");
            entity.Property(e => e.VolumeSize).HasMaxLength(50).IsRequired();

            // Configure relationship with Products
            entity.HasMany(d => d.Products)
                .WithOne(p => p.Volume)
                .HasForeignKey(p => p.VolumeId)
                .HasConstraintName("FK__Products__VolumeI__345678");
        });

        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(e => e.ProductId).HasName("PK__Products__B40CC6EDC1C834BC");
            entity.Property(e => e.ProductId).HasColumnName("ProductID");
            entity.Property(e => e.ProductName).HasMaxLength(100).IsRequired();
            entity.Property(e => e.Description).HasColumnType("nvarchar(max)");
            entity.Property(e => e.Price).HasColumnType("decimal(18,2)");
            entity.Property(e => e.Stock).HasDefaultValue(0);
            entity.Property(e => e.MainIngredients).HasColumnType("nvarchar(max)");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            // Configure relationships
            entity.HasOne(d => d.Brand)
                .WithMany(p => p.Products)
                .HasForeignKey(d => d.BrandId)
                .HasConstraintName("FK__Products__BrandI__123456");

            entity.HasOne(d => d.Volume)
                .WithMany(p => p.Products)
                .HasForeignKey(d => d.VolumeId)
                .HasConstraintName("FK__Products__VolumeI__345678");

            entity.HasOne(d => d.SkinType)
                .WithMany(p => p.Products)
                .HasForeignKey(d => d.SkinTypeId)
                .HasConstraintName("FK__Products__SkinTy__30F848ED");

            entity.HasOne(d => d.Category)
                .WithMany(p => p.Products)
                .HasForeignKey(d => d.CategoryId)
                .HasConstraintName("FK__Products__CategoryI__234567");
        });

        modelBuilder.Entity<ProductImage>(entity =>
        {
            entity.HasKey(e => e.ImageId).HasName("PK__ProductI__7516F70C12345678");
            entity.Property(e => e.ImageId).HasColumnName("ImageID");
            entity.Property(e => e.ProductId).HasColumnName("ProductID");
            entity.Property(e => e.ImageUrl).IsRequired();
            entity.Property(e => e.IsMainImage).HasDefaultValue(false);

            // Configure relationship with Product
            entity.HasOne(d => d.Product)
                .WithMany(p => p.Images)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__ProductImages__ProductID__456789");
        });

        modelBuilder.Entity<DashboardReport>(entity =>
        {
            entity.HasKey(e => e.ReportId).HasName("PK__Dashboar__D5BD48E52B62A4F8");

            entity.Property(e => e.ReportId).HasColumnName("ReportID");
            entity.Property(e => e.TotalSales).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.SalesGrowthRate).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.OrdersGrowthRate).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.UserGrowthRate).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.OverallGrowthRate).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.RevenueData).HasColumnType("nvarchar(max)");
            entity.Property(e => e.OrdersData).HasColumnType("nvarchar(max)");
            entity.Property(e => e.LastUpdated)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.TimeRange).HasMaxLength(50);
        });

        modelBuilder.Entity<Feedback>(entity =>
        {
            entity.HasKey(e => e.FeedbackId).HasName("PK__Feedback__6A4BEDF6DDCDD187");

            entity.Property(e => e.FeedbackId).HasColumnName("FeedbackID");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.ProductId).HasColumnName("ProductID");
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.Product).WithMany(p => p.Feedbacks)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Feedbacks__Produ__44FF419A");

            entity.HasOne(d => d.User).WithMany(p => p.Feedbacks)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Feedbacks__UserI__45F365D3");
        });

        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasKey(e => e.OrderId).HasName("PK__Orders__C3905BAFEDF282D4");

            entity.Property(e => e.OrderId).HasColumnName("OrderID");
            entity.Property(e => e.OrderDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.PaymentMethod).HasMaxLength(50);
            entity.Property(e => e.Status)
                .HasMaxLength(50)
                .HasDefaultValue("Pending");
            entity.Property(e => e.TotalAmount).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.User).WithMany(p => p.Orders)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Orders__UserID__37A5467C");
        });

        modelBuilder.Entity<OrderDetail>(entity =>
        {
            entity.HasKey(e => e.OrderDetailId).HasName("PK__OrderDet__D3B9D30C69E8AD20");

            entity.Property(e => e.OrderDetailId).HasColumnName("OrderDetailID");
            entity.Property(e => e.OrderId).HasColumnName("OrderID");
            entity.Property(e => e.Price).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.ProductId).HasColumnName("ProductID");

            entity.HasOne(d => d.Order).WithMany(p => p.OrderDetails)
                .HasForeignKey(d => d.OrderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__OrderDeta__Order__3C69FB99");

            entity.HasOne(d => d.Product).WithMany(p => p.OrderDetails)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__OrderDeta__Produ__3D5E1FD2");
        });

        modelBuilder.Entity<Payment>(entity =>
        {
            entity.HasKey(e => e.PaymentId).HasName("PK__Payments__9B556A58FE62822A");

            entity.Property(e => e.PaymentId).HasColumnName("PaymentID");
            entity.Property(e => e.Amount).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.OrderId).HasColumnName("OrderID");
            entity.Property(e => e.PaymentDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.PaymentStatus)
                .HasMaxLength(50)
                .HasDefaultValue("Pending");

            entity.HasOne(d => d.Order).WithMany(p => p.Payments)
                .HasForeignKey(d => d.OrderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Payments__OrderI__403A8C7D");
        });

        modelBuilder.Entity<PaymentHistory>(entity =>
        {
            entity.HasKey(e => e.HistoryId).HasName("PK__PaymentH__4D7B4ADD70EB71AE");

            entity.ToTable("PaymentHistory");

            entity.Property(e => e.HistoryId).HasColumnName("HistoryID");
            entity.Property(e => e.Amount).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.PaymentDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.PaymentId).HasColumnName("PaymentID");
            entity.Property(e => e.PaymentStatus).HasMaxLength(50);

            entity.HasOne(d => d.Payment).WithMany(p => p.PaymentHistories)
                .HasForeignKey(d => d.PaymentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__PaymentHi__Payme__4CA06362");
        });

        modelBuilder.Entity<Promotion>(entity =>
        {
            entity.HasKey(e => e.PromotionId).HasName("PK__Promotio__52C42F2F29F30FEF");

            entity.Property(e => e.PromotionId).HasColumnName("PromotionID");
            entity.Property(e => e.DiscountPercentage).HasColumnType("decimal(5, 2)");
            entity.Property(e => e.EndDate).HasColumnType("datetime");
            entity.Property(e => e.PromotionName).HasMaxLength(100);
            entity.Property(e => e.StartDate).HasColumnType("datetime");
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.RoleId).HasName("PK__Roles__8AFACE1A7F60ED59");
            entity.Property(e => e.RoleId).HasColumnName("RoleID");
            entity.Property(e => e.RoleName).HasMaxLength(50).IsRequired();

            // Configure relationship with Users
            entity.HasMany(d => d.Users)
                .WithOne(p => p.Role)
                .HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("FK__Users__RoleID__567890");
        });

        modelBuilder.Entity<SkinRoutine>(entity =>
        {
            entity.HasKey(e => e.RoutineId).HasName("PK__SkinRout__A6E3E51A2FFDE45D");

            entity.Property(e => e.RoutineId).HasColumnName("RoutineID");
            entity.Property(e => e.RoutineStep).HasMaxLength(255);
            entity.Property(e => e.SkinTypeId).HasColumnName("SkinTypeID");

            entity.HasOne(d => d.SkinType).WithMany(p => p.SkinRoutines)
                .HasForeignKey(d => d.SkinTypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__SkinRouti__SkinT__34C8D9D1");
        });

        modelBuilder.Entity<Skintype>(entity =>
        {
            entity.ToTable("Skintypes");
            
            entity.HasKey(e => e.SkinTypeId).HasName("PK__Skintype__D5D2962BEEC6528A");
            entity.Property(e => e.SkinTypeId).HasColumnName("SkinTypeID");
            entity.Property(e => e.SkinTypeName).HasMaxLength(50);

            // Configure relationships
            entity.HasMany(d => d.Products)
                .WithOne(p => p.SkinType)
                .HasForeignKey(p => p.SkinTypeId)
                .HasConstraintName("FK__Products__SkinTypeID__123456");

            entity.HasMany(d => d.SkinRoutines)
                .WithOne(p => p.SkinType)
                .HasForeignKey(p => p.SkinTypeId)
                .HasConstraintName("FK__SkinRoutines__SkinTypeID__234567");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__Users__1788CC4C7F60ED59");
            entity.Property(e => e.UserId).HasColumnName("UserID");
            entity.Property(e => e.RoleId).HasColumnName("RoleID");
            entity.Property(e => e.Username).HasMaxLength(50).IsRequired();
            entity.Property(e => e.Password).HasMaxLength(255).IsRequired();
            entity.Property(e => e.PasswordHash).HasMaxLength(255).IsRequired();
            entity.Property(e => e.FullName).HasMaxLength(100);
            entity.Property(e => e.Email).HasMaxLength(100);
            entity.Property(e => e.PhoneNumber).HasMaxLength(15);
            entity.Property(e => e.Address).HasMaxLength(255);
            entity.Property(e => e.IsVerification).HasDefaultValue(false);
            entity.Property(e => e.IsBanned).HasDefaultValue(false);
            entity.Property(e => e.ExpirationToken).HasColumnType("nvarchar(max)");
            entity.Property(e => e.VerificationToken).HasColumnType("nvarchar(max)");
            entity.Property(e => e.CreatedAt).HasColumnType("datetime");

            // Configure relationship with Role
            entity.HasOne(d => d.Role)
                .WithMany(p => p.Users)
                .HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("FK__Users__RoleID__567890");
        });

        modelBuilder.Entity<Feedback>(entity =>
        {
            entity.HasKey(e => e.FeedbackId).HasName("PK__Feedback__6A4B2B454B7734FF");
            entity.Property(e => e.FeedbackId).HasColumnName("FeedbackID");
            entity.Property(e => e.ProductId).HasColumnName("ProductID");
            entity.Property(e => e.UserId).HasColumnName("UserID");
            entity.Property(e => e.Comment).HasColumnType("nvarchar(max)");
            entity.Property(e => e.CreatedAt).HasColumnType("datetime");

            // Configure relationships
            entity.HasOne(d => d.Product)
                .WithMany(p => p.Feedbacks)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__Feedback__ProductID__678901");

            entity.HasOne(d => d.User)
                .WithMany(p => p.Feedbacks)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__Feedback__UserID__789012");
        });

        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasKey(e => e.OrderId).HasName("PK__Orders__C3905BAF96C8F1E7");
            entity.Property(e => e.OrderId).HasColumnName("OrderID");
            entity.Property(e => e.UserId).HasColumnName("UserID");
            entity.Property(e => e.OrderDate).HasColumnType("datetime");
            entity.Property(e => e.TotalAmount).HasColumnType("decimal(18,2)");
            entity.Property(e => e.Status).HasMaxLength(50);
            entity.Property(e => e.PaymentMethod).HasMaxLength(50);

            // Configure relationship with User
            entity.HasOne(d => d.User)
                .WithMany(p => p.Orders)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("FK__Orders__UserID__890123");
        });

        modelBuilder.Entity<OrderDetail>(entity =>
        {
            entity.HasKey(e => e.OrderDetailId).HasName("PK__OrderDet__D3B9D30C7F60ED59");
            entity.Property(e => e.OrderDetailId).HasColumnName("OrderDetailID");
            entity.Property(e => e.OrderId).HasColumnName("OrderID");
            entity.Property(e => e.ProductId).HasColumnName("ProductID");
            entity.Property(e => e.Price).HasColumnType("decimal(18,2)");

            // Configure relationships
            entity.HasOne(d => d.Order)
                .WithMany(p => p.OrderDetails)
                .HasForeignKey(d => d.OrderId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__OrderDetails__OrderID__901234");

            entity.HasOne(d => d.Product)
                .WithMany(p => p.OrderDetails)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("FK__OrderDetails__ProductID__012345");
        });

        modelBuilder.Entity<Payment>(entity =>
        {
            entity.HasKey(e => e.PaymentId).HasName("PK__Payments__9B556A587F60ED59");
            entity.Property(e => e.PaymentId).HasColumnName("PaymentID");
            entity.Property(e => e.OrderId).HasColumnName("OrderID");
            entity.Property(e => e.PaymentDate).HasColumnType("datetime");
            entity.Property(e => e.Amount).HasColumnType("decimal(18,2)");
            entity.Property(e => e.PaymentStatus).HasMaxLength(50);

            // Configure relationship with Order
            entity.HasOne(d => d.Order)
                .WithMany(p => p.Payments)
                .HasForeignKey(d => d.OrderId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__Payments__OrderID__123456");
        });

        modelBuilder.Entity<PaymentHistory>(entity =>
        {
            entity.HasKey(e => e.HistoryId).HasName("PK__PaymentH__4D7B4ADD7F60ED59");
            entity.Property(e => e.HistoryId).HasColumnName("HistoryID");
            entity.Property(e => e.PaymentId).HasColumnName("PaymentID");
            entity.Property(e => e.PaymentDate).HasColumnType("datetime");
            entity.Property(e => e.Amount).HasColumnType("decimal(18,2)");
            entity.Property(e => e.PaymentStatus).HasMaxLength(50).IsRequired();

            // Configure relationship with Payment
            entity.HasOne(d => d.Payment)
                .WithMany(p => p.PaymentHistories)
                .HasForeignKey(d => d.PaymentId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__PaymentHistory__PaymentID__234567");
        });

        modelBuilder.Entity<Promotion>(entity =>
        {
            entity.HasKey(e => e.PromotionId).HasName("PK__Promotio__52C42F2F7F60ED59");
            entity.Property(e => e.PromotionId).HasColumnName("PromotionID");
            entity.Property(e => e.PromotionName).HasMaxLength(100);
            entity.Property(e => e.DiscountPercentage).HasColumnType("decimal(18,2)");
            entity.Property(e => e.StartDate).HasColumnType("datetime");
            entity.Property(e => e.EndDate).HasColumnType("datetime");
        });

        modelBuilder.Entity<DashboardReport>(entity =>
        {
            entity.HasKey(e => e.ReportId).HasName("PK__Dashboar__D5BD48E57F60ED59");
            entity.Property(e => e.ReportId).HasColumnName("ReportID");
            entity.Property(e => e.TotalSales).HasColumnType("decimal(18,2)");
            entity.Property(e => e.SalesGrowthRate).HasColumnType("decimal(18,2)");
            entity.Property(e => e.OrdersGrowthRate).HasColumnType("decimal(18,2)");
            entity.Property(e => e.UserGrowthRate).HasColumnType("decimal(18,2)");
            entity.Property(e => e.OverallGrowthRate).HasColumnType("decimal(18,2)");
            entity.Property(e => e.RevenueData).HasColumnType("nvarchar(max)");
            entity.Property(e => e.OrdersData).HasColumnType("nvarchar(max)");
            entity.Property(e => e.LastUpdated).HasColumnType("datetime");
            entity.Property(e => e.TimeRange).HasMaxLength(50);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
