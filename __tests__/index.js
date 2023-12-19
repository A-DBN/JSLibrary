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
