namespace PackageTracking.Models
{
    public class StatusChange
    {
        public PackageStatus Status { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}
