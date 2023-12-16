import { _case, _FiletoJson, _wait, _createShellCommands, _forEachInObject } from '../src/index';


describe('_case', () => {
    it('executes the correct function based on the case key', () => {
        const result = _case('case1', 
            ['case1', () => 'Case 1 executed'], 
            ['case2', () => 'Case 2 executed']
        );
        expect(result).toBe('Case 1 executed');
    });

    it('executes the default function for an undefined case key', () => {
        const result = _case('case3', 
            ['case1', () => 'Case 1 executed'], 
            ['case2', () => 'Case 2 executed'],
            () => 'Default case executed'
        );
        expect(result).toBe('Default case executed');
    });

    it('executes the function with the variable as an argument', () => {
        const testvar = "echo"
        const echoCase = jest.fn(() => `Echo: ${testvar}`);
        const result = _case(testvar, 
            ['echo', echoCase],
            ['test', () => 'Test executed']
        );

        expect(result).toBe('Echo: echo');
    });

    it('throws an error for an undefined case key without a default function', () => {
        expect(() => {
            _case('case3', 
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

        await _wait(waitTime, 'ms');

        const end = new Date().getTime();
        const elapsed = end - start;

        expect(elapsed).toBeGreaterThanOrEqual(waitTime);
    });

    it('waits for 1s second as with seconds', async () => {
        const waitTime = 1;
        const start = new Date().getTime();

        await _wait(waitTime, 's');

        const end = new Date().getTime();
        const elapsed = end - start;

        expect(elapsed).toBeGreaterThanOrEqual(waitTime);
    });

    it('waits for 1 second with a bad unit', async () => {
        const waitTime = 1;
        const start = new Date().getTime();

        await _wait(waitTime, 'bad');

        const end = new Date().getTime();
        const elapsed = end - start;

        expect(elapsed).toBeGreaterThanOrEqual(waitTime);
    });
});

describe('_forEachInObject', () => {
    it('executes the callback for each key-value pair in the object', () => {
        const testObject = { a: 1, b: 2, c: 3 };
        const mockCallback = jest.fn();

        _forEachInObject(testObject, mockCallback);

        expect(mockCallback.mock.calls.length).toBe(3);
        expect(mockCallback).toHaveBeenCalledWith(1, 'a');
        expect(mockCallback).toHaveBeenCalledWith(2, 'b');
        expect(mockCallback).toHaveBeenCalledWith(3, 'c');
    });
});