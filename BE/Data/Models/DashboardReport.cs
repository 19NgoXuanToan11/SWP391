using System;
using System.Collections.Generic;

namespace Data.Models;

public partial class DashboardReport
{
    public int ReportId { get; set; }

    public string? ReportName { get; set; }

    public string? ReportData { get; set; }

    public DateTime? CreatedAt { get; set; }
}
