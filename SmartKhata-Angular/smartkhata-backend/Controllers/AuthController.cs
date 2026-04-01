using Microsoft.AspNetCore.Mvc;
using SmartKhata.Data;
using SmartKhata.Models;

namespace SmartKhata.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            var user = _context.ShopSettings
                .FirstOrDefault(x =>
                    x.PhoneNumber == request.PhoneNumber &&
                    x.Password == request.Password);

            if (user != null)
            {
                return Ok(new LoginResponse
                {
                    Success = true,
                    Message = "Login successful"
                });
            }

            return Unauthorized(new LoginResponse
            {
                Success = false,
                Message = "Invalid phone or password"
            });
        }
    }
}