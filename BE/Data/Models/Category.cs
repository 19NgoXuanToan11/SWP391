using System.ComponentModel.DataAnnotations.Schema;

namespace Data.Models;

[Table("Categories")]
public partial class Category
{
    public int CategoryId { get; set; }
    public string CategoryName { get; set; } = null!;
    public string? Description { get; set; }
    public virtual ICollection<Product> Products { get; set; } = new List<Product>();
}