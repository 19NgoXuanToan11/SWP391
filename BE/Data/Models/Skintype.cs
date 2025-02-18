using System;
using System.Collections.Generic;

namespace Data.Models;

public partial class Skintype
{
    public int SkinTypeId { get; set; }

    public string SkinTypeName { get; set; } = null!;

    public virtual ICollection<Product> Products { get; set; } = new List<Product>();

    public virtual ICollection<SkinRoutine> SkinRoutines { get; set; } = new List<SkinRoutine>();
}
