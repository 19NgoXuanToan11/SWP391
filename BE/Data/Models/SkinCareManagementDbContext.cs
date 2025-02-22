using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.ComponentModel.DataAnnotations.Schema;

namespace Data.Models;

public partial class SkinCareManagementDbContext : DbContext
{
    public SkinCareManagementDbContext()
    {
    }

    public SkinCareManagementDbContext(DbContextOptions<SkinCareManagementDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<DashboardReport> DashboardReports { get; set; }

    public virtual DbSet<Feedback> Feedbacks { get; set; }

    public virtual DbSet<Order> Orders { get; set; }

    public virtual DbSet<OrderDetail> OrderDetails { get; set; }

    public virtual DbSet<Payment> Payments { get; set; }

    public virtual DbSet<PaymentHistory> PaymentHistories { get; set; }

    public virtual DbSet<Product> Products { get; set; }

    public virtual DbSet<Promotion> Promotions { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<SkinRoutine> SkinRoutines { get; set; }

    public virtual DbSet<SkinType> SkinTypes { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<Brand> Brands { get; set; }

    public virtual DbSet<Volume> Volumes { get; set; }

    public virtual DbSet<Category> Categories { get; set; }

    public virtual DbSet<ProductImage> ProductImages { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer(GetConnectionString());
    private string GetConnectionString()
    {
        IConfiguration config = new ConfigurationBuilder()
         .SetBasePath(Directory.GetCurrentDirectory())
        .AddJsonFile("appsettings.json", true, true)
        .Build();
        var strConn = config["ConnectionStrings:SkinCareManagementDB"];

        return strConn;
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<DashboardReport>(entity =>
        {
            entity.HasKey(e => e.ReportId).HasName("PK__Dashboar__D5BD48E52B62A4F8");

            entity.Property(e => e.ReportId).HasColumnName("ReportID");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.ReportName).HasMaxLength(255);
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

        modelBuilder.Entity<Product>(entity =>
        {
            entity.ToTable("Products");

            entity.HasKey(e => e.ProductId);

            entity.Property(e => e.ProductId).HasColumnName("ProductID");
            entity.Property(e => e.ProductName).HasColumnName("ProductName").IsRequired();
            entity.Property(e => e.Description).HasColumnName("Description").HasColumnType("nvarchar(max)");
            entity.Property(e => e.Price).HasColumnName("Price").HasColumnType("decimal(10, 2)");
            entity.Property(e => e.Stock).HasColumnName("Stock");
            entity.Property(e => e.MainIngredients).HasColumnName("MainIngredients").HasColumnType("nvarchar(max)");
            entity.Property(e => e.BrandId).HasColumnName("BrandID");
            entity.Property(e => e.VolumeId).HasColumnName("VolumeID");
            entity.Property(e => e.SkinTypeId).HasColumnName("SkinTypeID");
            entity.Property(e => e.CategoryId).HasColumnName("CategoryID");
            entity.Property(e => e.CreatedAt).HasColumnName("CreatedAt").HasColumnType("datetime");
            entity.Property(e => e.ImageUrl).HasColumnName("ImageUrl").HasColumnType("nvarchar(max)");

            // Thiết lập quan hệ với Brand
            entity.HasOne(d => d.Brand)
                .WithMany(p => p.Products)
                .HasForeignKey(d => d.BrandId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("FK_Products_Brand");

            // Thiết lập quan hệ với Volume
            entity.HasOne(d => d.Volume)
                .WithMany(p => p.Products)
                .HasForeignKey(d => d.VolumeId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("FK_Products_Volume");

            // Thiết lập quan hệ với SkinType
            entity.HasOne(d => d.SkinType)
                .WithMany(p => p.Products)
                .HasForeignKey(d => d.SkinTypeId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("FK_Products_SkinType");

            // Thiết lập quan hệ với Category
            entity.HasOne(d => d.Category)
                .WithMany(p => p.Products)
                .HasForeignKey(d => d.CategoryId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("FK_Products_Category");

            // Thiết lập quan hệ với ProductImage (1 Product có nhiều ảnh)
            entity.HasMany(p => p.Images)
                .WithOne(i => i.Product)
                .HasForeignKey(i => i.ProductId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_Product_Images");

            // Thiết lập quan hệ với Feedback (1 Product có nhiều Feedback)
            entity.HasMany(p => p.Feedbacks)
                .WithOne(f => f.Product)
                .HasForeignKey(f => f.ProductId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_Product_Feedbacks");

            // Thiết lập quan hệ với OrderDetail (1 Product có nhiều OrderDetails)
            entity.HasMany(p => p.OrderDetails)
                .WithOne(od => od.Product)
                .HasForeignKey(od => od.ProductId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("FK_Product_OrderDetails");
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
            entity.HasKey(e => e.RoleId).HasName("PK__Roles__8AFACE3A15A92472");

            entity.HasIndex(e => e.RoleName, "UQ__Roles__8A2B616001986CD2").IsUnique();

            entity.Property(e => e.RoleId).HasColumnName("RoleID");
            entity.Property(e => e.RoleName).HasMaxLength(50);
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

        modelBuilder.Entity<SkinType>(entity =>
        {
            entity.HasKey(e => e.SkinTypeId).HasName("PK__SkinType__D5D2962BEEC6528A");

            entity.HasIndex(e => e.SkinTypeName, "UQ__SkinType__3F55C929689F2351").IsUnique();

            entity.Property(e => e.SkinTypeId).HasColumnName("SkinTypeID");
            entity.Property(e => e.SkinTypeName).HasMaxLength(50);
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__Users__1788CCAC2A045CD7");

            entity.HasIndex(e => e.Username, "UQ__Users__536C85E49D2556D1").IsUnique();

            entity.HasIndex(e => e.Email, "UQ__Users__A9D1053473532155").IsUnique();

            entity.Property(e => e.UserId).HasColumnName("UserID");
            entity.Property(e => e.Address).HasMaxLength(255);
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Email).HasMaxLength(100);
            entity.Property(e => e.FullName).HasMaxLength(100);
            entity.Property(e => e.Password).HasMaxLength(255);
            entity.Property(e => e.PhoneNumber).HasMaxLength(15);
            entity.Property(e => e.RoleId).HasColumnName("RoleID");
            entity.Property(e => e.Username).HasMaxLength(50);

            entity.HasOne(d => d.Role).WithMany(p => p.Users)
                .HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Users__RoleID__29572725");
        });

        modelBuilder.Entity<ProductImage>(entity =>
        {
            entity.HasKey(e => e.ImageId).HasName("PK__ProductI__1788CCAC2A045CD7");

            entity.Property(e => e.ImageId).HasColumnName("ImageID");
            entity.Property(e => e.ProductId).HasColumnName("ProductID");
            entity.Property(e => e.ImageUrl).HasMaxLength(255);

            entity.HasOne(d => d.Product).WithMany(p => p.Images)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ProductIm__Produ__403A8C7D");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
