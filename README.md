# Dynamic-Utils

Dynamic-Utils is a JavaScript utility library providing a set of functions for common operations such as dynamic case structures, file reading and processing, waiting with time units, creating shell command functions, object and array manipulations, and more.

## Installation

You can install DynamicUtils using npm or yarn:

```bash
npm install dynamic-utils
```
or
```bash
yarn add dynamic-utils
```

## Usage

Import the functions from the library as follows:
```js
import {
  _case,
  _FiletoJson,
  _wait,
  _createShellCommands,
  _forEachInObject,
  _removeDuplicates,
  _ObjectToArray,
  _ArrayToObject
} from 'dynamic-utils';
```

## Functions

``_case(variable, ...couples[, defaultFunc])``: Acts as a dynamic switch-case structure.

`_FiletoJson(path[, options, processFunction])`: Reads a JSON file and converts it to a JSON object. Can take a processing function.

`_wait(value, unit)`: Returns a Promise that resolves after the specified time.

`_createShellCommands(commands)`: Creates an object containing functions for executing specified shell commands.

`_forEachInObject(obj, callback)`: Iterates over the properties of an object and executes a callback for each key-value pair.

`_removeDuplicates(array[, except])`: Removes duplicates from an array, with an option to exclude certain values.

`_ObjectToArray(obj)`: Converts an object to an array of key-value pairs, including for nested structures.

`_ArrayToObject(array[, keyIndex])`: Converts an array of key-value pairs to an object.

## Exemples

Below are some examples of how you can use the library functions:

### Dynamic Switch Case

```js
const variableToMatch = 'case3';
const result = _case(variableToMatch,
  ['case1', () => 'Case 1 executed'],
  ['case2', x => `Case 2 executed with value: ${x}`],
  () => 'Default case executed'
);
console.log(result); // Output: 'Default case executed'
```

### Read and Process JSON File

```js
// Synchronous processing
const jsonObject = _FiletoJson('path/to/file.json', {}, data => processData(data));
console.log(jsonObject);

// Asynchronous processing
_FiletoJson('path/to/file.json', {}, async data => {
  return await processAsync(data);
}).then(result => console.log(result));
```

### Wait Function

```js
_wait(10, 's').then(() => console.log('Waited 10 seconds.'));
```

### Shell Command Execution

```js
const gitCmds = _createShellCommands([{ 'pull': 'git pull' }, { 'status': 'git status' }]);
gitCmds.pull().then(stdout => console.log(stdout)).catch(err => console.error(err));
```

### Iterate Over Object Properties
```js
const myObject = { a: 10, b: 20, c: 30 };
_forEachInObject(myObject, (value, key) => {
  console.log(`Key ${key}: Value ${value}`);
});
```

## Contributing

Contributions are always welcome! Please read the contribution guidelines first.
