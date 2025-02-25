public class CreateProductDTO
{
    public string ProductName { get; set; } = null!;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public int? Stock { get; set; }
    public string? MainIngredients { get; set; }
    public int? BrandId { get; set; }
    public int? VolumeId { get; set; }
    public int? SkinTypeId { get; set; }
    public int? CategoryId { get; set; }
    public List<string> ImageUrls { get; set; } = new List<string>();
}