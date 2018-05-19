function parseQs(qs) {
    var items = qs.split('?')[1].split('&');
    data = {};
    items.forEach((item) => {
        let [key, val] = item.split('=');
        data[key] = val;
    });
    return data;
}

module.exports = {
    parseQs
};