using MediatR;
using Microsoft.AspNetCore.Mvc;
using Stemi.WebAPI.Features.Payments.Commands.CreatePayment;
using Stemi.WebAPI.Features.Payments.Commands.DeletePayment;
using Stemi.WebAPI.Features.Payments.Commands.UpdatePayment;
using Stemi.WebAPI.Features.Payments.Queries.GetPaymentById;
using Stemi.WebAPI.Features.Payments.Queries.GetStudentPayments;
using Stemi.WebAPI.Models.DTOs;

namespace Stemi.WebAPI.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public class PaymentsController : ControllerBase
	{
		private readonly IMediator _mediator;

		public PaymentsController(IMediator mediator)
		{
			_mediator = mediator;
		}

		[HttpGet("student/{studentId}")]
		public async Task<ActionResult<List<PaymentDto>>> GetStudentPayments(Guid studentId)
		{
			var payments = await _mediator.Send(new GetStudentPaymentsQuery { StudentId = studentId });
			return Ok(payments);
		}

		[HttpGet("{id}")]
		public async Task<ActionResult<PaymentDto>> GetPayment(int id)
		{
			var payment = await _mediator.Send(new GetPaymentByIdQuery { Id = id });
			return payment != null ? Ok(payment) : NotFound();
		}

		[HttpPost]
		public async Task<ActionResult<int>> CreatePayment(CreatePaymentCommand command)
		{
			var paymentId = await _mediator.Send(command);
			return CreatedAtAction(nameof(GetPayment), new { id = paymentId }, paymentId);
		}

		[HttpPut("{id}")]
		public async Task<IActionResult> UpdatePayment(int id, UpdatePaymentCommand command)
		{
			if (id != command.Id) return BadRequest();
			await _mediator.Send(command);
			return NoContent();
		}

		[HttpDelete("{id}")]
		public async Task<IActionResult> DeletePayment(int id)
		{
			await _mediator.Send(new DeletePaymentCommand { Id = id });
			return NoContent();
		}
	}
}
