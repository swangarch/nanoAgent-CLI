import random
import time
from quicksort import quicksort, quicksort_inplace

def test_basic_sorting():
    print("Testing basic sorting...")
    test_cases = [
        [],
        [1],
        [2, 1],
        [3, 2, 1],
        [1, 2, 3, 4, 5],
        [5, 4, 3, 2, 1],
        [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5]
    ]
    
    for i, test_case in enumerate(test_cases):
        original = test_case.copy()
        sorted_result = quicksort(test_case.copy())
        test_case_copy = test_case.copy()
        quicksort_inplace(test_case_copy)
        
        expected = sorted(original)
        
        if sorted_result == expected and test_case_copy == expected:
            print(f"  Test {i+1}: PASSED - {original} -> {sorted_result}")
        else:
            print(f"  Test {i+1}: FAILED - {original} -> Expected: {expected}, Got: {sorted_result}")

def test_random_arrays():
    print("\nTesting random arrays...")
    for size in [10, 100, 1000]:
        test_array = [random.randint(1, 1000) for _ in range(size)]
        original = test_array.copy()
        
        # Test quicksort (functional version)
        sorted_result = quicksort(test_array.copy())
        expected = sorted(original)
        
        # Test quicksort_inplace (in-place version)
        test_array_copy = test_array.copy()
        quicksort_inplace(test_array_copy)
        
        if sorted_result == expected and test_array_copy == expected:
            print(f"  Random array size {size}: PASSED")
        else:
            print(f"  Random array size {size}: FAILED")

def test_performance():
    print("\nTesting performance...")
    sizes = [1000, 5000, 10000]
    
    for size in sizes:
        test_array = [random.randint(1, 100000) for _ in range(size)]
        
        # Test functional version
        array_copy = test_array.copy()
        start_time = time.time()
        quicksort(array_copy)
        func_time = time.time() - start_time
        
        # Test in-place version
        array_copy = test_array.copy()
        start_time = time.time()
        quicksort_inplace(array_copy)
        inplace_time = time.time() - start_time
        
        print(f"  Size {size}:")
        print(f"    Functional: {func_time:.4f}s")
        print(f"    In-place: {inplace_time:.4f}s")

if __name__ == "__main__":
    print("Quick Sort Test Suite")
    print("=" * 40)
    
    test_basic_sorting()
    test_random_arrays()
    test_performance()
    
    print("\n" + "=" * 40)
    print("Testing completed!")
