import * as lib from '../src/index';


describe('_case', () => {
    it('executes the correct function based on the case key', () => {
        const result = lib._case('case1', 
            ['case1', () => 'Case 1 executed'], 
            ['case2', () => 'Case 2 executed']
        );
        expect(result).toBe('Case 1 executed');
    });

    it('executes the default function for an undefined case key', () => {
        const result = lib._case('case3', 
            ['case1', () => 'Case 1 executed'], 
            ['case2', () => 'Case 2 executed'],
            () => 'Default case executed'
        );
        expect(result).toBe('Default case executed');
    });

    it('executes the function with the variable as an argument', () => {
        const testvar = "echo"
        const echoCase = jest.fn(() => `Echo: ${testvar}`);
        const result = lib._case(testvar, 
            ['echo', echoCase],
            ['test', () => 'Test executed']
        );

        expect(result).toBe('Echo: echo');
    });

    it('throws an error for an undefined case key without a default function', () => {
        expect(() => {
            lib._case('case3', 
                ['case1', () => 'Case 1 executed'], 
                ['case2', () => 'Case 2 executed']
            );
        }).toThrow('No case found for key: case3');
    });
});

describe('_wait', () => {
    it('waits for 1s as with miliseconds', async () => {
        const waitTime = 1000; // 1 second
        const start = new Date().getTime();

        await lib._wait(waitTime, 'ms');

        const end = new Date().getTime();
        const elapsed = end - start;

        expect(elapsed).toBeGreaterThanOrEqual(waitTime);
    });

    it('waits for 1s second as with seconds', async () => {
        const waitTime = 1;
        const start = new Date().getTime();

        await lib._wait(waitTime, 's');

        const end = new Date().getTime();
        const elapsed = end - start;

        expect(elapsed).toBeGreaterThanOrEqual(waitTime);
    });

    it('waits for 1 second with a bad unit', async () => {
        const waitTime = 1;
        const start = new Date().getTime();

        await lib._wait(waitTime, 'bad');

        const end = new Date().getTime();
        const elapsed = end - start;

        expect(elapsed).toBeGreaterThanOrEqual(waitTime);
    });
});

describe('_forEachInObject', () => {
    it('executes the callback for each key-value pair in the object', () => {
        const testObject = { a: 1, b: 2, c: 3 };
        const mockCallback = jest.fn();

        lib._forEachInObject(testObject, mockCallback);

        expect(mockCallback.mock.calls.length).toBe(3);
        expect(mockCallback).toHaveBeenCalledWith(1, 'a');
        expect(mockCallback).toHaveBeenCalledWith(2, 'b');
        expect(mockCallback).toHaveBeenCalledWith(3, 'c');
    });
});

describe('_removeDuplicates function tests', () => {
    test('should remove duplicates without exceptions', () => {
        const myArray = [1, 2, 3, 1, 2, 3, 4, 5];
        const result = lib._removeDuplicates(myArray);
        expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    test('should remove duplicates with exceptions', () => {
        const myArray = [1, 2, 3, 1, 2, 3, 4, 5];
        const result = lib._removeDuplicates(myArray, [1, 2]);
        expect(result).toEqual([1, 2, 3, 1, 2, 4, 5]);
    });

    test('should handle empty array', () => {
        const myArray = [];
        const result = lib._removeDuplicates(myArray);
        expect(result).toEqual([]);
    });
});

describe('_ObjectToArray function tests', () => {
    test('should correctly convert simple object to array of key-value pairs', () => {
        const myObject = { a: 10, b: 20, c: 30 };
        const result = lib._ObjectToArray(myObject);
        expect(result).toEqual([['a', 10], ['b', 20], ['c', 30]]);
    });

    test('should correctly handle nested objects and arrays', () => {
        const myObject = {
            a: [1, 2, 3],
            b: {
                c: [4, 5, 6],
                d: {
                    e: [7, 8, 9]
                }
            }
        };
        const result = lib._ObjectToArray(myObject);
        expect(result).toEqual([['a', [1, 2, 3]], ['b', [['c', [4, 5, 6]], ['d', [['e', [7, 8, 9]]]]]]]);
    });

    test('should return empty array for empty object', () => {
        const myObject = {};
        const result = lib._ObjectToArray(myObject);
        expect(result).toEqual([]);
    });

    test('should throw error for non-object types', () => {
        expect(() => lib._ObjectToArray(null)).toThrow();
        expect(() => lib._ObjectToArray(undefined)).toThrow();
        expect(() => lib._ObjectToArray(123)).toThrow();
        expect(() => lib._ObjectToArray('string')).toThrow();
        expect(() => lib._ObjectToArray(true)).toThrow();
    });
});


describe('_ArrayToObject function tests', () => {
    test('should convert array to object with key at index 0', () => {
        const myArray = [['a', 10], ['b', 20], ['c', 30]];
        const result = lib._ArrayToObject(myArray, 0);
        expect(result).toEqual({ a: 10, b: 20, c: 30 });
    });

    test('should convert array to object with key at index 1', () => {
        const myArray = [['a', 10], ['b', 20], ['c', 30]];
        const result = lib._ArrayToObject(myArray, 1);
        expect(result).toEqual({ 10: 'a', 20: 'b', 30: 'c' });
    });

    test('should handle arrays with more than two elements', () => {
        const myArray = [['a', 10, 'x'], ['b', 20, 'y'], ['c', 30, 'z']];
        const result = lib._ArrayToObject(myArray, 0);
        expect(result).toEqual({ a: [10, 'x'], b: [20, 'y'], c: [30, 'z'] });
    });

    test('should throw error if key is out of scope', () => {
        const myArray = [['a', 10], ['b', 20]];
        expect(() => {
            lib._ArrayToObject(myArray, 2);
        }).toThrow('Key index is out of bounds');
    });
});


