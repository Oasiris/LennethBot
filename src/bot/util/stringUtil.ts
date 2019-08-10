const STR_LENGTH_LIMIT = 2000

export class StringUtil {

    /**
     * Returns a string as a list of tokens.
     * @param {String} str 
     */
    static tokenize(str: string) {
        return str
            .trim()
            .split(/\s+/)
            .map((s) => s.trim())
    }

    /**
     * Returns a string, sans first N tokens (where N is tokenStartIndex.)
     * @param {String} string 
     * @param {Number} tokenStartIndex 
     */
    static getSuffix(str, tokenStartIndex) {
        const tokens = StringUtil.tokenize(str)

        let latestIdx = 0
        {
            let t = 0  // Token counter
            while (t < tokenStartIndex) {
                const fromIdx = latestIdx > 0 ? latestIdx + 1 : 0;
                const nextIdx = str.indexOf(tokens[t], fromIdx)
                
                const didFindToken = (nextIdx > latestIdx) && nextIdx !== -1
                if (didFindToken) {
                    latestIdx = nextIdx
                    t++
                } else {
                    throw new Error(`Error getting suffix @ token ${tokenStartIndex} of "${str}"`)
                }
            }
        }
        
        return str.slice(latestIdx).trim()
    }

    static getSimpleSuffix(tokens, tokenStartIndex) {
        return tokens.slice(tokenStartIndex.join(' '))
    }
}