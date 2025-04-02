using Data.Models;
using Repo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service
{
    public class HistoryService : IHistoryService
    {
        private readonly IHistoryRepository _historyrepo;
        public HistoryService(IHistoryRepository historyrepo)
        {
            _historyrepo = historyrepo;
        }
        public async Task AddAsync(History history)
        {
            await _historyrepo.AddAsync(history);
        }

        public async Task<IEnumerable<History>> GetAllHistoriesAsync()
        {
            return await _historyrepo.GetAllAsync();
        }

        public async Task<IEnumerable<History>> GetHistoriesByUserIdAsync(int userId)
        {
            return await _historyrepo.GetHistoriesByUserIdAsync(userId);
        }

        public async Task<History?> GetHistoryByTrackingCodeAsync(string trackingCode)
        {
            return await _historyrepo.GetByTrackingCodeAsync(trackingCode);
        }

        public async Task<History?> GetOrderHistoryByOrderIdAsync(int orderId)
        {
            return await _historyrepo.GetOrderHistoryByOrderIdAsync(orderId);
        }

        public async Task UpdateHistoryStatusAsync(string trackingCode, string status)
        {
            var history = await _historyrepo.GetByTrackingCodeAsync(trackingCode);
            if (history != null)
            {
                history.Status = status;
                await _historyrepo.UpdateAsync(history);
            }
        }

    }
}
