using PackageTracking.Models;

namespace PackageTracking.DTOs
{
    public class PackageListDto
    {
        public string TrackingNumber { get; set; } = string.Empty;
        public string SenderName { get; set; } = string.Empty;
        public string RecipientName { get; set; } = string.Empty;
        public PackageStatus CurrentStatus { get; set; } 
        public DateTime CreatedAt { get; set; }
    }
}
