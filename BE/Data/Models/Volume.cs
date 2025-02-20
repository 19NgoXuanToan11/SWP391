namespace Data.Models;

public partial class Volume
{
    public int VolumeId { get; set; }
    public string VolumeValue { get; set; } = null!;  // e.g., "100ml", "200ml"
    public virtual ICollection<Product> Products { get; set; } = new List<Product>();
}