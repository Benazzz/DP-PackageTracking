using PackageTracking.Models;

namespace PackageTracking.Services
{
    public interface IPackageService
    {
        IEnumerable<Package> GetAll();
        Package GetById(Guid id);
        Package Create(Package package);
        Package ChangeStatus(Guid id, PackageStatus newStatus);
    }
}
