// Controllers/AuthController.cs
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

        [HttpPost("signup")]
        public IActionResult Signup([FromBody] SignupRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.OwnerName))
                return BadRequest(new SignupResponse { Success = false, Message = "Owner name is required." });

            if (string.IsNullOrWhiteSpace(request.PhoneNumber))
                return BadRequest(new SignupResponse { Success = false, Message = "Phone number is required." });

            if (string.IsNullOrWhiteSpace(request.ShopName))
                return BadRequest(new SignupResponse { Success = false, Message = "Shop name is required." });

            if (string.IsNullOrWhiteSpace(request.City))
                return BadRequest(new SignupResponse { Success = false, Message = "City is required." });

            if (string.IsNullOrWhiteSpace(request.Password) || request.Password.Length < 6)
                return BadRequest(new SignupResponse { Success = false, Message = "Password must be at least 6 characters." });

            bool phoneExists = _context.ShopSettings
                .Any(x => x.PhoneNumber == request.PhoneNumber);

            if (phoneExists)
                return Conflict(new SignupResponse
                {
                    Success = false,
                    Message = "An account with this phone number already exists."
                });

            var shop = new ShopSettings
            {
                ShopName    = request.ShopName.Trim(),
                OwnerName   = request.OwnerName.Trim(),
                PhoneNumber = request.PhoneNumber.Trim(),
                City        = request.City.Trim(),
                Currency    = request.Currency?.Trim() ?? "PKR",
                Password    = request.Password   // ✅ plain text, no hashing
            };

            _context.ShopSettings.Add(shop);
            _context.SaveChanges();

            return StatusCode(201, new SignupResponse
            {
                Success = true,
                Message = "Account created successfully."
            });
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            var normalizedInput = request.PhoneNumber.Replace("-", "").Replace(" ", "").Trim();

            var user = _context.ShopSettings
                .AsEnumerable()
                .FirstOrDefault(x =>
                    x.PhoneNumber.Replace("-", "").Replace(" ", "") == normalizedInput);

            // ✅ plain text comparison
            if (user != null && user.Password == request.Password)
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
                Message = "Invalid phone number or password."
            });
        }
    }
}