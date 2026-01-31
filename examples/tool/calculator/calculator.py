#!/usr/bin/env python3
"""
Simple Calculator Application
Supports basic arithmetic operations: +, -, *, /, //
"""

class Calculator:
    """Calculator class with basic arithmetic operations"""
    
    def add(self, a, b):
        """Addition operation"""
        return a + b
    
    def subtract(self, a, b):
        """Subtraction operation"""
        return a - b
    
    def multiply(self, a, b):
        """Multiplication operation"""
        return a * b
    
    def divide(self, a, b):
        """Division operation"""
        if b == 0:
            raise ValueError("Cannot divide by zero")
        return a / b
    
    def floor_divide(self, a, b):
        """Floor division operation"""
        if b == 0:
            raise ValueError("Cannot divide by zero")
        return a // b
    
    def modulo(self, a, b):
        """Modulo operation"""
        if b == 0:
            raise ValueError("Cannot divide by zero")
        return a % b
    
    def power(self, a, b):
        """Power operation"""
        return a ** b

def main():
    """Main function to run the calculator"""
    calc = Calculator()
    
    print("Welcome to Python Calculator!")
    print("Available operations:")
    print("1. Addition (+)")
    print("2. Subtraction (-)")
    print("3. Multiplication (*)")
    print("4. Division (/)")
    print("5. Floor Division (//)")
    print("6. Modulo (%)")
    print("7. Power (**)")
    print("Type 'quit' to exit")
    
    while True:
        try:
            # Get operation choice
            operation = input("\nEnter operation (+, -, *, /, //, %, **) or 'quit': ").strip()
            
            if operation.lower() == 'quit':
                print("Goodbye!")
                break
            
            if operation not in ['+', '-', '*', '/', '//', '%', '**']:
                print("Invalid operation. Please try again.")
                continue
            
            # Get numbers
            try:
                num1 = float(input("Enter first number: "))
                num2 = float(input("Enter second number: "))
            except ValueError:
                print("Please enter valid numbers.")
                continue
            
            # Perform calculation
            if operation == '+':
                result = calc.add(num1, num2)
                print(f"{num1} + {num2} = {result}")
            elif operation == '-':
                result = calc.subtract(num1, num2)
                print(f"{num1} - {num2} = {result}")
            elif operation == '*':
                result = calc.multiply(num1, num2)
                print(f"{num1} * {num2} = {result}")
            elif operation == '/':
                result = calc.divide(num1, num2)
                print(f"{num1} / {num2} = {result}")
            elif operation == '//':
                result = calc.floor_divide(num1, num2)
                print(f"{num1} // {num2} = {result}")
            elif operation == '%':
                result = calc.modulo(num1, num2)
                print(f"{num1} % {num2} = {result}")
            elif operation == '**':
                result = calc.power(num1, num2)
                print(f"{num1} ** {num2} = {result}")
                
        except ValueError as e:
            print(f"Error: {e}")
        except Exception as e:
            print(f"An unexpected error occurred: {e}")

if __name__ == "__main__":
    main()
