

function tokenize(str) {
    return str.trim().split(/\s+/).map(s => s.trim())
}

function getTokenSuffix(tokens, tokenStartIndex) {
    return tokens.slice(tokenStartIndex).join(' ')
}



// This should only be called once the bot is ready
function startCli(bot, logger) {
    // handleData needs to access bot and
    function handleData(bufferData) {
        const stringData = String(bufferData)
        const tokens = tokenize(data)
    }




    const stdin = process.openStdin()
    stdin.addListener('data', handleData)

}





module.exports = startCli