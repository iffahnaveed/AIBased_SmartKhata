// Models/SignupRequest.cs
namespace SmartKhata.Models
{
    public class SignupRequest
    {
        public string  ShopName    { get; set; } = "";
        public string  OwnerName   { get; set; } = "";   // was FullName before
        public string  PhoneNumber { get; set; } = "";
        public string  City        { get; set; } = "";
        public string? Currency    { get; set; }
        public string  Password    { get; set; } = "";
    }

    public class SignupResponse
    {
        public bool   Success { get; set; }
        public string Message { get; set; } = "";
    }
}