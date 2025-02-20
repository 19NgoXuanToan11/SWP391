using System.ComponentModel.DataAnnotations.Schema;

namespace Data.Models;

[Table("ProductImage")]
public partial class ProductImage
{
    public int ImageId { get; set; }
    public int ProductId { get; set; }
    public string ImageUrl { get; set; } = null!;
    public bool IsMainImage { get; set; }
    public virtual Product Product { get; set; } = null!;
}