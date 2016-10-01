# millify
Convert long numbers into a human-readable format, e.g. `25000` to `'25K'`

### Installation
```bash
npm i millify
```

### Usage
#### `millify(@number, @decimal)`

First parameter is the number, second parameter is the desired decimal places (default: 1).

```js
import millify from 'millify'

millify(2500)
// 2.5K

millify(1250000, 3)
// 1.25M

millify(2000000000)
// 2B
```

