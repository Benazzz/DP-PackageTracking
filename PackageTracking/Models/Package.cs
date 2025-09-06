namespace PackageTracking.Models
{
    public class Package
    {
        public Guid Id { get; set; }
        public string TrackingNumber { get; set; } = string.Empty;
        public string SenderName { get; set; } = string.Empty;
        public string SenderPhone { get; set; } = string.Empty;
        public string SenderAddress { get; set; } = string.Empty;
        public string RecipientName { get; set; } = string.Empty;
        public string RecipientPhone { get; set; } = string.Empty;
        public string RecipientAddress { get; set; } = string.Empty;
        public PackageStatus CurrentStatus { get; set; } = PackageStatus.Created;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public List<StatusChange> StatusHistory { get; set; } = new();
    }
}