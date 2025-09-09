using PackageTracking.Data;
using PackageTracking.Models;
using PackageTracking.Services;

namespace PackageTrackingBackend.Data
{
    public class SeedData
    {
        public SeedData(PackageDbContext context)
        {
            var service = new PackageService(context);

            var packages = new List<Package>
            {
                new Package
                {
                    SenderName = "Alice",
                    SenderPhone = "123456789",
                    SenderAddress = "123 Main St",
                    RecipientName = "Bob",
                    RecipientPhone = "987654321",
                    RecipientAddress = "456 Park Ave",
                },
                new Package
                {
                    SenderName = "Charlie",
                    SenderPhone = "5551234",
                    SenderAddress = "789 Elm St",
                    RecipientName = "Dave",
                    RecipientPhone = "5559876",
                    RecipientAddress = "321 Oak St",
                },
                new Package
                {
                    SenderName = "Eve",
                    SenderPhone = "111222333",
                    SenderAddress = "12 Pine St",
                    RecipientName = "Frank",
                    RecipientPhone = "444555666",
                    RecipientAddress = "98 Maple Ave",
                },
                new Package
                {
                    SenderName = "Grace",
                    SenderPhone = "222333444",
                    SenderAddress = "56 Birch Rd",
                    RecipientName = "Heidi",
                    RecipientPhone = "777888999",
                    RecipientAddress = "34 Cedar Ln",
                },
                new Package
                {
                    SenderName = "Ivan",
                    SenderPhone = "333444555",
                    SenderAddress = "78 Walnut St",
                    RecipientName = "Judy",
                    RecipientPhone = "888999000",
                    RecipientAddress = "67 Cherry Blvd",
                },
                new Package
                {
                    SenderName = "Ken",
                    SenderPhone = "444555666",
                    SenderAddress = "90 Spruce St",
                    RecipientName = "Laura",
                    RecipientPhone = "999000111",
                    RecipientAddress = "21 Willow Ave",
                },
                new Package
                {
                    SenderName = "Mallory",
                    SenderPhone = "555666777",
                    SenderAddress = "34 Aspen Rd",
                    RecipientName = "Niaj",
                    RecipientPhone = "111222333",
                    RecipientAddress = "78 Poplar Ln",
                },
                new Package
                {
                    SenderName = "Olivia",
                    SenderPhone = "666777888",
                    SenderAddress = "12 Fir St",
                    RecipientName = "Peggy",
                    RecipientPhone = "222333444",
                    RecipientAddress = "45 Cypress Ave",
                },
                new Package
                {
                    SenderName = "Quentin",
                    SenderPhone = "777888999",
                    SenderAddress = "56 Redwood Blvd",
                    RecipientName = "Ruth",
                    RecipientPhone = "333444555",
                    RecipientAddress = "89 Oak St",
                },
                new Package
                {
                    SenderName = "Steve",
                    SenderPhone = "888999000",
                    SenderAddress = "90 Pine Rd",
                    RecipientName = "Trudy",
                    RecipientPhone = "444555666",
                    RecipientAddress = "23 Maple St",
                }
            };

            foreach (var pkg in packages)
            {
                service.Create(pkg);
            }
        }
    }
}
