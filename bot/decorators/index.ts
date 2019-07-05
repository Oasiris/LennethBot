// function log(target, name, descriptor) {

// }

function log1(wrapped) {
    return function() {
        console.log('Starting')
        const result = wrapped.apply(this, arguments)
        console.log('Finished')
        return result
    }
}

function doSomething(name) {
    console.log(`Hello, ${name}`)
}

const wrapped = log1(doSomething)

// ———————————————

// Property decorator.
function log2() {
    return function(target, name, descriptor) {
        const original = descriptor.value
        const isFunction = typeof original === 'function'
        if (isFunction) {
            descriptor.value = function(...args) {
                console.log(`Arguments: ${args}`)
                try {
                    const result = original.apply(this, args)
                    console.log(`Result: ${result}`)
                } catch (e) {
                    console.error(`Error: ${e}`)
                    throw e
                }
            }
        }
        return descriptor;
    }
}