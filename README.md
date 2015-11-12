# millify
Human-readable large numbers for Node.js v4+

### Installation
```
npm i --save millify
```

### Example
```
const millify = require('millify')

millify(2500)
// 2.5K

millify(1250000, 3)
// 1.25M
```

### `millify(@number, @decimal)`

First parameter is the number, second parameter is the desired decimal places.
