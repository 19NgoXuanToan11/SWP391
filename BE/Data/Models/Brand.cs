﻿using System.ComponentModel.DataAnnotations.Schema;

namespace Data.Models;

[Table("Brand")]
public partial class Brand
{
    public int BrandId { get; set; }
    public string BrandName { get; set; } = null!;
    public string? Description { get; set; }
    public virtual ICollection<Product> Products { get; set; } = new List<Product>();
}