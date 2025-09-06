using PackageTracking.Models;

namespace PackageTracking.DTOs
{
    public class StatusChangeDto
    {
        public PackageStatus Status { get; set; }
        public DateTime Timestamp { get; set; } 
    }
}
