## Available Commands

| Command          | Description                                                                     |
| ---------------- | ------------------------------------------------------------------------------- |
| `yarn`           | Install project dependencies                                                    |
| `yarn start`     | Build project and open web server running project                               |
| `yarn run build` | Builds code bundle with production settings (minification, uglification, etc..) |

## How to publish

```sh
yarn build
./publish.sh
git commit -m "version: x.x.x"
```
