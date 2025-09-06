using AutoMapper;
using PackageTracking.Models;
using PackageTracking.DTOs;

namespace PackageTracking.Helpers
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<StatusChange, StatusChangeDto>();
            CreateMap<Package, PackageListDto>();
            CreateMap<Package, PackageDto>();
        }
    }
}
