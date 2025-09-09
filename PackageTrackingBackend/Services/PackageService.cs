using PackageTracking.Data;
using PackageTracking.Models;

namespace PackageTracking.Services
{
    public class PackageService : IPackageService
    {
        private readonly PackageDbContext _context;

        public PackageService(PackageDbContext context)
        {
            _context = context;
        }

        public IEnumerable<Package> GetAll()
        {
            return _context.Packages.ToList();
        }

        public Package GetById(Guid id)
        {
            return _context.Packages.FirstOrDefault(p => p.Id == id);
        }

        public Package Create(Package package)
        {
            package.TrackingNumber = Guid.NewGuid().ToString().Substring(0, 8).ToUpper();
            package.CurrentStatus = PackageStatus.Created;
            package.CreatedAt = DateTime.UtcNow;

            package.StatusHistory.Add(new StatusChange { Status = PackageStatus.Created, Timestamp = DateTime.UtcNow });

            _context.Packages.Add(package);
            _context.SaveChanges();

            return package;
        }

        private static readonly Dictionary<PackageStatus, PackageStatus[]> AllowedTransitions = new()
        {
            {PackageStatus.Created, new[] {PackageStatus.Sent, PackageStatus.Canceled}},
            {PackageStatus.Sent, new[] {PackageStatus.Accepted, PackageStatus.Returned, PackageStatus.Canceled}},
            {PackageStatus.Returned, new[] {PackageStatus.Sent, PackageStatus.Canceled}},
            {PackageStatus.Accepted, Array.Empty<PackageStatus>()},
            {PackageStatus.Canceled, Array.Empty<PackageStatus>()}
        };

        public Package ChangeStatus(Guid id, PackageStatus newStatus)
        {
            var package = GetById(id);
            if (package == null)
            {
                throw new KeyNotFoundException("Package not found");
            }
            if (!AllowedTransitions[package.CurrentStatus].Contains(newStatus))
            {
                throw new Exception($"Cannot change status from {package.CurrentStatus} to {newStatus}");
            }
            package.CurrentStatus = newStatus;
            package.StatusHistory.Add(new StatusChange { Status = newStatus, Timestamp = DateTime.UtcNow });
            _context.SaveChanges();
            return package;
        }
    }
}
