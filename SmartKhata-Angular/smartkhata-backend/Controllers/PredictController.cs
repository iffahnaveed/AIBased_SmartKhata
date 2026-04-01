using Microsoft.AspNetCore.Mvc;

namespace SmartKhata.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PredictController : ControllerBase
    {
        private readonly HttpClient _http;

        public PredictController(IHttpClientFactory factory)
        {
            _http = factory.CreateClient();
        }

        // GET api/predict/all
        [HttpGet("all")]
        public async Task<IActionResult> GetAll()
        {
            var response = await _http.GetAsync("http://localhost:8000/predict/all");
            var content  = await response.Content.ReadAsStringAsync();
            return Content(content, "application/json");
        }

        // GET api/predict/product/{name}
        [HttpGet("product/{name}")]
        public async Task<IActionResult> GetByProduct(string name)
        {
            var response = await _http.GetAsync($"http://localhost:8000/predict/product/{name}");
            var content  = await response.Content.ReadAsStringAsync();
            return Content(content, "application/json");
        }
    }
}