function getResult(req, res) {
    const { year, term, studentClass } = req.body;
    const { id } = req.decoded;

    console.log("hello");


}

module.exports = {
    getResult
};
