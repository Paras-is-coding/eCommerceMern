const generateRandomString = (len = 100) => {
    let chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    let lengths = chars.length;
    let random = "";
    for(let i = 1; i <= len; i++) {
        let posn = Math.ceil(Math.random() * (lengths-1));
        random += chars[posn]
    }
    return random
}



module.exports = {generateRandomString}