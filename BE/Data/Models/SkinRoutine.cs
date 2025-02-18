using System;
using System.Collections.Generic;

namespace Data.Models;

public partial class SkinRoutine
{
    public int RoutineId { get; set; }

    public int SkinTypeId { get; set; }

    public string RoutineStep { get; set; } = null!;

    public virtual Skintype SkinType { get; set; } = null!;
}
