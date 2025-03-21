using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System;
using System.Collections.Generic;
using static Org.BouncyCastle.Asn1.Cmp.Challenge;
using System.ComponentModel.DataAnnotations.Schema;

namespace Data.Models;

[Table("Products")]
public partial class Product
{
    public int ProductId { get; set; }

    public string ProductName { get; set; } = null!;

    public string? Description { get; set; }

    public decimal Price { get; set; }

    public int? Stock { get; set; }

    public string? MainIngredients { get; set; }

    // Foreign keys
    public int? BrandId { get; set; }
    public int? VolumeId { get; set; }
    public int? SkinTypeId { get; set; }
    public int? CategoryId { get; set; }

    public DateTime? CreatedAt { get; set; }

    // Navigation properties
    public virtual Brand? Brand { get; set; }
    public virtual Volume? Volume { get; set; }
    public virtual Skintype? SkinType { get; set; }
    public virtual Category? Category { get; set; }
    public virtual ICollection<ProductImage> Images { get; set; } = new List<ProductImage>();
    public virtual ICollection<Feedback> Feedbacks { get; set; } = new List<Feedback>();
    public virtual ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();
}
