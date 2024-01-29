function getUuid(length = 8) {
    let len = length
    const str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let uuid = ''
    for (let i = 0; i < len; i++) {
        uuid += str[Math.floor(Math.random() * str.length)]
    }
    return uuid
}

module.exports = {
    getUuid
}