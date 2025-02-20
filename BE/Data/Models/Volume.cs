using System.ComponentModel.DataAnnotations.Schema;

namespace Data.Models;

[Table("Volume")]
public partial class Volume
{
    public int VolumeId { get; set; }
    
    [Column("Size")]
    public string Size { get; set; } = null!;
    
    public virtual ICollection<Product> Products { get; set; } = new List<Product>();
}