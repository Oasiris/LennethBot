import * as globby from 'globby'
import { uniq, flatten, map, mergeAll, pipe as ramdaPipe } from 'ramda'
const pipe = <any>ramdaPipe

// ——————

const options = {
    onlyFiles: true,
    absolute: true,
};

export const commandFiles = uniq(
    flatten([
        // globby.sync(`${__dirname}/*(!(index.js))`, options),
        globby.sync(`${__dirname}/*/index.js`, options),
        globby.sync(`${__dirname}/*/*/index.js`, options),
        globby.sync(`${__dirname}/*(!(help))/*.js`, options)
    ])
);

const commands = pipe(
    map((filepath: string) => require(filepath)),
    mergeAll,
)(commandFiles)

console.log({ commandFiles, commands })

export default commands