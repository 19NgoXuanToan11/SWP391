<<<<<<< Updated upstream
﻿namespace Data.Models
=======
﻿using System;
using System.Collections.Generic;

namespace Data.Models;

public partial class Payment
>>>>>>> Stashed changes
{
    public int PaymentId { get; set; }

<<<<<<< Updated upstream
        // Mối quan hệ với Order
        public virtual Order Order { get; set; }

        // Mối quan hệ với PaymentHistory
        public virtual ICollection<PaymentHistory> PaymentHistories { get; set; }
    }
}
=======
    public int OrderId { get; set; }

    public DateTime? PaymentDate { get; set; }

    public decimal? Amount { get; set; }

    public string? PaymentStatus { get; set; }

    public virtual Order Order { get; set; } = null!;

    public virtual ICollection<PaymentHistory> PaymentHistories { get; set; } = new List<PaymentHistory>();
}
>>>>>>> Stashed changes
