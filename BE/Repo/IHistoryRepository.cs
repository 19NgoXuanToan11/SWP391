using Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repo
{
    public interface IHistoryRepository
    {
        Task<IEnumerable<History>> GetAllAsync();
        Task<History?> GetByTrackingCodeAsync(string trackingCode);
        Task AddAsync(History history);
        Task UpdateAsync(History history);
    }
}
