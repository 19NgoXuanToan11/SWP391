using Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service
{
    public interface IHistoryService
    {
        Task<IEnumerable<History>> GetAllHistoriesAsync();
        Task<History?> GetHistoryByTrackingCodeAsync(string trackingCode);
        Task AddHistoryAsync(History history);
        Task UpdateHistoryStatusAsync(string trackingCode, string status);
    }
}
