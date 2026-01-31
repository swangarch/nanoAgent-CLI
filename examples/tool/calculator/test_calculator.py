#!/usr/bin/env python3
"""
Test file for Calculator class
"""

from calculator import Calculator

def test_calculator():
    """Test all calculator operations"""
    calc = Calculator()
    
    # Test cases
    test_cases = [
        # (operation, num1, num2, expected_result)
        ('add', 10, 5, 15),
        ('subtract', 10, 5, 5),
        ('multiply', 10, 5, 50),
        ('divide', 10, 5, 2.0),
        ('floor_divide', 10, 3, 3),
        ('modulo', 10, 3, 1),
        ('power', 2, 3, 8),
    ]
    
    print("Running Calculator Tests...")
    
    for operation, num1, num2, expected in test_cases:
        try:
            if operation == 'add':
                result = calc.add(num1, num2)
            elif operation == 'subtract':
                result = calc.subtract(num1, num2)
            elif operation == 'multiply':
                result = calc.multiply(num1, num2)
            elif operation == 'divide':
                result = calc.divide(num1, num2)
            elif operation == 'floor_divide':
                result = calc.floor_divide(num1, num2)
            elif operation == 'modulo':
                result = calc.modulo(num1, num2)
            elif operation == 'power':
                result = calc.power(num1, num2)
            
            status = "PASS" if result == expected else "FAIL"
            print(f"{operation}({num1}, {num2}) = {result} [{status}]")
            
        except Exception as e:
            print(f"{operation}({num1}, {num2}) - ERROR: {e}")
    
    # Test division by zero
    print("\nTesting division by zero...")
    try:
        calc.divide(10, 0)
        print("ERROR: Should have raised ValueError")
    except ValueError as e:
        print(f"PASS: Correctly caught error - {e}")

if __name__ == "__main__":
    test_calculator()
