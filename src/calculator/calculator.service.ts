import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class CalculatorService {
  evaluate(expression: string): number {
    try {
      this.validateExpression(expression);

      const tokens = this.tokenize(expression);

      return this.calculate(tokens);
    } catch (error) {
      throw new BadRequestException(`Invalid expression, ${error?.message}`);
    }
  }

  private validateExpression(expression: string): void {
    const validCharacters = /^[0-9+\-*/() ]+$/;
    const operatorPattern = /(\+\+|--|\*\*|\/\/)/g;
    const invalidEnd = /[+\-*/]$/;
    const invalidStart = /^[+\-*/]/;

    if (!validCharacters.test(expression)) {
      throw new Error('Expression contains invalid characters');
    }

    if (operatorPattern.test(expression)) {
      throw new Error('Expression contains invalid operator sequences');
    }

    if (invalidEnd.test(expression)) {
      throw new Error('Expression cannot end with an operator');
    }

    if (invalidStart.test(expression)) {
      throw new Error('Expression cannot start with an operator');
    }
  }

  private tokenize(expression: string): string[] {
    return expression.match(/\d+|\+|\-|\*|\/|\(|\)/g);
  }

  private calculate(tokens: string[]): number {
    const operators = {
      '+': (a: number, b: number) => a + b,
      '-': (a: number, b: number) => a - b,
      '*': (a: number, b: number) => a * b,
      '/': (a: number, b: number) => {
        if (b === 0) throw new Error('Division by zero');

        return a / b;
      },
    };

    const outputQueue: string[] = [];
    const operatorStack: string[] = [];

    const precedence = { '+': 1, '-': 1, '*': 2, '/': 2 };

    tokens.forEach((token) => {
      if (/\d/.test(token)) {
        outputQueue.push(token);
      } else if (['+', '-', '*', '/'].includes(token)) {
        while (
          operatorStack.length &&
          precedence[operatorStack[operatorStack.length - 1]] >=
            precedence[token]
        ) {
          outputQueue.push(operatorStack.pop());
        }
        operatorStack.push(token);
      } else if (token === '(') {
        operatorStack.push(token);
      } else if (token === ')') {
        while (operatorStack[operatorStack.length - 1] !== '(') {
          outputQueue.push(operatorStack.pop());
        }
        operatorStack.pop();
      }
    });

    while (operatorStack.length) {
      outputQueue.push(operatorStack.pop());
    }

    const stack: number[] = [];
    outputQueue.forEach((token) => {
      if (/\d/.test(token)) {
        stack.push(Number(token));
      } else {
        const b = stack.pop();
        const a = stack.pop();
        stack.push(operators[token](a, b));
      }
    });

    return stack[0];
  }
}
