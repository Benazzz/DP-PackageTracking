using Microsoft.AspNetCore.Mvc;
using PackageTracking.Models;
using AutoMapper;
using PackageTracking.Services;
using PackageTracking.DTOs;


namespace PackageTracking.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PackagesController : ControllerBase
    {
        private readonly IPackageService _packageService;
        private readonly IMapper _mapper;

        public PackagesController(IPackageService packageService, IMapper mapper)
        {
            _packageService = packageService;
            _mapper = mapper;
        }

        [HttpGet]
        public ActionResult<IEnumerable<PackageListDto>> GetAll([FromQuery] string? trackingNumber, [FromQuery] PackageStatus? status)
        {
            var packages = _packageService.GetAll();

            if(!string.IsNullOrEmpty(trackingNumber))
            {
                packages = packages.Where(p => p.TrackingNumber.Contains(trackingNumber, StringComparison.OrdinalIgnoreCase));
            }

            if(status.HasValue)
            {
                packages = packages.Where(p => p.CurrentStatus == status.Value);
            }

            var packageDtos = _mapper.Map<IEnumerable<PackageListDto>>(packages);
            return Ok(packageDtos);
        }

        [HttpGet("{id}")]
        public ActionResult<PackageListDto> GetById(Guid id)
        {
            var package = _packageService.GetById(id);
            if (package == null)
            {
                return NotFound();
            }
            var packageDto = _mapper.Map<PackageDto>(package);
            return Ok(packageDto);
        }

        [HttpPost]
        public ActionResult<PackageListDto> Create([FromBody] CreatePackageDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var package = _mapper.Map<Package>(dto);
            var created = _packageService.Create(package);
            var result = _mapper.Map<PackageListDto>(created);

            return CreatedAtAction(nameof(GetById), new { id = created.Id }, result);
        }

        [HttpPost("{id}/status")]
        public ActionResult<PackageListDto> ChangeStatus(Guid id, [FromBody] PackageStatus newStatus)
        {
            try
            {
                var updated = _packageService.ChangeStatus(id, newStatus);
                var dto = _mapper.Map<PackageListDto>(updated);
                return Ok(dto);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
