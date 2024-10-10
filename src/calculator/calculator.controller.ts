import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { CalculatorService } from './calculator.service';
import { EvaluateExpressionResponse } from './dto/response.dto';
import { EvaluateExpressionRequest } from './dto/request.dto';

@Controller('evaluate')
export class CalculatorController {
  constructor(private readonly calculatorService: CalculatorService) {}

  @Post()
  @HttpCode(200)
  evaluateExpression(
    @Body() { expression }: EvaluateExpressionRequest,
  ): EvaluateExpressionResponse {
    const result = this.calculatorService.evaluate(expression);
    return { result };
  }
}
