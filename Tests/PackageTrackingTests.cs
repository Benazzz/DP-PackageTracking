using Microsoft.EntityFrameworkCore;
using PackageTracking.Data;
using PackageTracking.Models;
using PackageTracking.Services;

namespace Tests
{
    [TestClass]
    public sealed class PackageTrackingTests
    {
        private PackageDbContext _context;
        private PackageService _service;

        [TestInitialize]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<PackageDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new PackageDbContext(options);
            _service = new PackageService(_context);
            _context.Database.EnsureCreated();
        }

        [TestMethod]
        public void Create_ShouldGenerateTrackingNumber_AndSetDefaukts()
        {
            //Arrange
            var package = new Package
            {
                SenderName = "SenderName",
                RecipientName = "RecipientName"
            };

            //Act
            var result = _service.Create(package);


            //Assert
            Assert.IsNotNull(result);
            Assert.IsFalse(string.IsNullOrEmpty(result.TrackingNumber));
            Assert.AreEqual(PackageStatus.Created, result.CurrentStatus);
            Assert.IsTrue(result.CreatedAt <= DateTime.UtcNow);
            Assert.AreEqual(1, result.StatusHistory.Count);
            Assert.AreEqual(PackageStatus.Created, result.StatusHistory.First().Status);
        }

        [TestMethod]
        public void GetAll_ShouldReturnAllPackages()
        {
            //Arrange
            _service.Create(new Package { SenderName = "A", RecipientName = "B" });
            _service.Create(new Package { SenderName = "C", RecipientName = "D" });

            //Act
            var packages = _service.GetAll();

            //Assert
            Assert.AreEqual(2, packages.Count());
        }

        [TestMethod]
        public void GetById_ShouldReturnCorrectPackage()
        {
            //Arrange
            var package = _service.Create(new Package { SenderName = "A", RecipientName = "B" });

            //Act
            var fetched = _service.GetById(package.Id);

            //Assert
            Assert.IsNotNull(fetched);
            Assert.AreEqual(package.Id, fetched.Id);
        }

        [TestMethod]
        public void GetById_ShouldReturnNull_IfNotFound()
        {
            //Act
            var fetched = _service.GetById(Guid.NewGuid());

            //Assert
            Assert.IsNull(fetched);
        }

        [TestMethod]
        public void ChangeStatus_ShouldUpdateStatus_WhenValidTransition()
        {
            //Arrange
            var package = _service.Create(new Package { SenderName = "A", RecipientName = "B" });

            //Act
            var updated = _service.ChangeStatus(package.Id, PackageStatus.Sent);

            //Assert
            Assert.AreEqual(PackageStatus.Sent, updated.CurrentStatus);
            Assert.AreEqual(2, updated.StatusHistory.Count); 
            Assert.AreEqual(PackageStatus.Sent, updated.StatusHistory.Last().Status);
        }

        [TestMethod]
        [ExpectedException(typeof(Exception))]
        public void ChangeStatus_ShouldThrowException_WhenInvalidTransition()
        {
            //Arrange
            var package = _service.Create(new Package { SenderName = "A", RecipientName = "B" });

            //Act 
            _service.ChangeStatus(package.Id, PackageStatus.Accepted);
        }

        [TestMethod]
        [ExpectedException(typeof(KeyNotFoundException))]
        public void ChangeStatus_ShouldThrowException_WhenPackageNotFound()
        {
            //Act
            _service.ChangeStatus(Guid.NewGuid(), PackageStatus.Sent);
        }
    }
}
