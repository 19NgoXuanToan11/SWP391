using Data.Models;
using Repo;

namespace Service
{
    public class RoleService : IRoleService
    {
        private readonly IRoleRepository _roleRepository;

        public RoleService(IRoleRepository roleRepository)
        {
            _roleRepository = roleRepository;
        }

        public async Task<IEnumerable<Role>> GetAllRolesAsync()
        {
            return await _roleRepository.GetAllAsync();
        }

        public async Task<Role?> GetRoleByIdAsync(int id)
        {
            return await _roleRepository.GetByIdAsync(id);
        }

        public async Task AddRoleAsync(Role role)
        {
            await _roleRepository.AddAsync(role);
        }

        public async Task UpdateRoleAsync(Role role)
        {
            await _roleRepository.UpdateAsync(role);
        }

        public async Task DeleteRoleAsync(int id)
        {
            await _roleRepository.DeleteAsync(id);
        }
    }
}
