using System.ComponentModel.DataAnnotations.Schema;

namespace Data.Models;

[Table("Volumes")]
public partial class Volume
{
    public int VolumeId { get; set; }

    [Column("VolumeSize")] 
    public string VolumeSize { get; set; } = null!;

    public virtual ICollection<Product> Products { get; set; } = new List<Product>();
}
