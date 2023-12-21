import fs from 'fs';
import { exec } from 'child_process';

/**
 * Creates a function that acts as a dynamic switch-case structure.
 * It takes a variable, pairs of case keys and associated functions, and an optional default function.
 * The function whose case key matches the variable is executed. If no match is found, the default function is executed.
 * If the executed function throws an error, the error is re-thrown.
 *
 * @param {any} variable - The variable to be matched against the case keys.
 * @param {...[any, Function]} couples - An infinite number of parameters,
 *                                       each a pair of a case key and a function.
 *                                       The case key is used to match the function
 *                                       to the provided variable.
 * @param {Function} [defaultFunc] - An optional default function to execute if no match is found.
 * @returns {any} The result of the executed function that matches the case key,
 *                or the result of the default function if no match is found.
 * @throws {Error} Re-throws any error that is thrown by the executed function.
 *
 * @example
 * 
 * const VariableToMatch = 'case3';
 * const result = _case(VariableToMatch,
 *   ['case1', () => 'Case 1 executed'],
 *   ['case2', (x) => `Case 2 executed with value: ${x}`],
 *   () => 'Default case executed'
 * );
 * console.log(result); // logs 'Default case executed'
 */
export const _case = (variable, ...couples) => {
    let defaultFunc = couples.pop();
    if (typeof defaultFunc !== 'function') {
        couples.push(defaultFunc);
        defaultFunc = () => { throw new Error(`No case found for key: ${variable}`); };
    }

    const switchLike = couples.reduce((acc, [caseKey, caseFunc]) => {
        acc[caseKey] = caseFunc;
        return acc;
    }, {});

    const caseFunc = switchLike[variable];
    try {
        if (caseFunc) {
            return caseFunc();
        } else {
            return defaultFunc();
        }
    } catch (error) {
        throw error;
    }
};


/**
 * Reads a JSON file from the specified path and converts its contents to a JSON object.
 * This function synchronously reads the entire contents of a file and then parses it as JSON.
 * It can optionally take a processing function, which can be either synchronous or asynchronous.
 * If the processing function is asynchronous, the function returns a Promise.
 *
 * @param {string} path - The file path from which to read the JSON data.
 * @param {Object} [options={}] - An options object to specify reading options.
 * @param {string} [options.encoding='utf-8'] - The character encoding to use when reading the file. Default is 'utf-8'.
 * @param {string} [options.flag=''] - File system flags for reading the file. Default is an empty string, which corresponds to 'r' (read) mode.
 * @param {Function} [processFunction] - An optional function to process the parsed JSON data. Can be sync or async.
 * @returns {Object|Promise} The processed data or a Promise resolving to it if the process function is asynchronous.
 *
 * @example
 * // Using a synchronous process function
 * const jsonObject = _FiletoJson('path/to/file.json', {}, data => processData(data));
 * console.log(jsonObject);
 *
 * @example
 * // Using an asynchronous process function
 * _FiletoJson('path/to/file.json', {}, async data => {
 *   return await processAsync(data);
 * }).then(result => console.log(result));
 */
export const _FiletoJson = (path, options = {}, processFunction) => {
    const data = fs.readFileSync(path, { encoding: options.encoding || 'utf-8', flag: options.flag || '' });
    const parsedData = JSON.parse(data);

    if (processFunction) {
        const result = processFunction(parsedData);

        if (result instanceof Promise) {
            // The process function is asynchronous
            return result;
        }

        // The process function is synchronous
        return result;
    }

    return parsedData;
};

/**
 * Waits for a specified amount of time.
 * 
 * @param {number} value - The amount of time to wait.
 * @param {string} unit - The unit of time ('ms', 's', 'm', 'h') for the value.
 * @returns {Promise} A promise that resolves after the specified time.
 */
export const _wait = (value, unit) => {
    return new Promise((resolve) => {
        let timeInMs;
        _case(unit,
            ['ms', () => timeInMs = value],
            ['s', () => timeInMs = value * 1000],
            ['m', () => timeInMs = value * 1000 * 60],
            ['h', () => timeInMs = value * 1000 * 60 * 60],
            () => { timeInMs = value}
        );
        setTimeout(resolve, timeInMs);
    });
}

/**
 * Creates an object containing functions for executing specified shell commands.
 * Each function in the object corresponds to a command and is named according to the provided mappings.
 * 
 * @param {Array<Object>} commands - An array of objects, each with a single key-value pair.
 *                                   The key is the name of the function, and the value is the shell command to execute.
 * @returns {Object} An object containing functions. Each function returns a Promise that resolves with the command's output or rejects with an error.
 *
 * @example
 * // Creating command functions
 * const gitCmds = createGitCommandFunctions([{ 'pull': 'git pull' }, { 'status': 'git status' }]);
 *
 * // Using the created functions
 * gitCmds.pull().then(stdout => console.log(stdout)).catch(err => console.error(err));
 * gitCmds.status().then(stdout => console.log(stdout)).catch(err => console.error(err));
 */
export const  _createShellCommands = (commands) => {
    const funcs = {};

    commands.forEach(commandPair => {
        const [name, cmd] = Object.entries(commandPair)[0];

        funcs[name] = function() {
            return new Promise((resolve, reject) => {
                exec(cmd, (err, stdout, stderr) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(stdout);
                });
            });
        };
    });

    return funcs;
}

/**
 * Iterates over the properties of the given object, executing the callback for each key-value pair.
 * The callback is invoked with two arguments: the value of the property and its key.
 *
 * @param {Object} obj - The object to iterate over.
 * @param {Function} callback - The function to execute for each key-value pair. 
 *                              It takes two parameters: the value of the property and its key.
 * @example
 * 
 * const myObject = { a: 10, b: 20, c: 30 };
 * _forEachInObject(myObject, (value, key) => {
 *   console.log(`Key ${key}: Value ${value}`);
 * });
 * // Output:
 * // Key a: Value 10
 * // Key b: Value 20
 * // Key c: Value 30
 */
export const _forEachInObject = (obj, callback) => {
    Object.keys(obj).forEach((key) => {
        callback(obj[key], key);
    });
};


/**
 * Removes all duplicates from an array.
 * 
 * @param {Array} array - The array to remove duplicates from.
 * @param {Array} [except=[]] - An optional array of values to exclude from the removal.
 * @returns {Array} A new array with all duplicates removed.
 * 
 * @example
 * 
 * const myArray = [1, 2, 3, 1, 2, 3, 4, 5];
 * const newArray = _removeDuplicates(myArray);
 * console.log(newArray); // logs [1, 2, 3, 4, 5]
 * 
 * @example
 * const myArray = [1, 2, 3, 1, 2, 3, 4, 5];
 * const newArray = _removeDuplicates(myArray, [1, 2]);
 * console.log(newArray); // logs [1, 2, 3, 1, 2, 4, 5]
 * 
 */
export const _removeDuplicates = (array, except = []) => {
    return array.filter((value, index, self) => self.indexOf(value) === index || except.includes(value));
}


/**
 * Converts an object, including nested objects and arrays, to an array of key-value pairs.
 * The conversion is recursive, preserving the structure of nested objects and arrays.
 *
 * @param {Object} obj - The object to convert.
 * @returns {Array} An array of key-value pairs. For nested objects, the value is an array of key-value pairs representing the nested structure.
 *
 * @example
 *
 * const myObject = {
 *   a: [1, 2, 3],
 *   b: {
 *     c: [4, 5, 6],
 *     d: {
 *       e: [7, 8, 9]
 *     }
 *   }
 * };
 * const myArray = _ObjectToArray(myObject);
 *
 * console.log(myArray); // logs [['a', [1, 2, 3]], ['b', [['c', [4, 5, 6]], ['d', [['e', [7, 8, 9]]]]]]
 */

export const _ObjectToArray = (obj) => {
    if (typeof obj !== 'object' || obj === null) {
        throw new Error('Input is not an object');
    }

    const transform = (item) => {
        if (Array.isArray(item)) {
            return item;
        } else if (typeof item === 'object') {
            return Object.entries(item).map(([key, val]) => [key, transform(val)]);
        } else {
            return item;
        }
    };

    return transform(obj);
}

/**
 * Converts an array of key-value pairs to an object.
 * 
 * @param {Array} array - The array to convert.
 * @param {Number} [key = 0] - Either 0 or 1 to specify which element of the pair is the key.
 * 
 * @example
 * 
 * const myArray = [['a', 10], ['b', 20], ['c', 30]];
 * const myObject = _ArrayToObject(myArray, 0);
 * 
 * console.log(myObject); // logs { a: 10, b: 20, c: 30 }
 * 
 * @example
 * 
 * const myArray = [['a', 10], ['b', 20], ['c', 30]];
 * const myObject = _ArrayToObject(myArray, 1);
 * 
 * console.log(myObject); // logs { 10: 'a', 20: 'b', 30: 'c' }
 */
export const _ArrayToObject = (array, keyIndex = 0) => {
    return array.reduce((acc, item) => {
        if (keyIndex < 0 || keyIndex >= item.length) {
            throw new Error('Key index is out of bounds');
        }

        const key = item[keyIndex];
        const values = [...item.slice(0, keyIndex), ...item.slice(keyIndex + 1)];

        acc[key] = values.length > 1 ? values : values[0] || null;
        return acc;
    }, {});
}

