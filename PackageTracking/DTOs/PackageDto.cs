using PackageTracking.Models;

namespace PackageTracking.DTOs
{
    public class PackageDto
    {
        public string TrackingNumber { get; set; } = string.Empty;
        public string SenderName { get; set; } = string.Empty;
        public string SenderPhone { get; set; } = string.Empty;
        public string SenderAddress { get; set; } = string.Empty;
        public string RecipientName { get; set; } = string.Empty;
        public string RecipientPhone { get; set; } = string.Empty;
        public string RecipientAddress { get; set; } = string.Empty;
        public PackageStatus CurrentStatus { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<StatusChangeDto> StatusHistory { get; set; } = new();
    }
}
