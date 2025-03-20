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
        Task AddAsync(History history);
        Task UpdateHistoryStatusAsync(string trackingCode, string status);
        Task<History?> GetOrderHistoryByOrderIdAsync(int orderId);
        Task<IEnumerable<History>> GetHistoriesByUserIdAsync(int userId);
    }
}
