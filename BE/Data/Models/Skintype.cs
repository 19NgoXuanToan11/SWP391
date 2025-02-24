using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Data.Models;

[Table("SkinTypes")]
public partial class Skintype
{
    public int SkinTypeId { get; set; }

    public string SkinTypeName { get; set; } = null!;

    public virtual ICollection<Product> Products { get; set; } = new List<Product>();

    public virtual ICollection<SkinRoutine> SkinRoutines { get; set; } = new List<SkinRoutine>();
}
