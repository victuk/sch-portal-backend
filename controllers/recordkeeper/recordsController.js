async function uploadRecords(req, res) {
    const {records} = req.body;
    res.json({message: "Uploaded Successfully."});
}

async function viewRecord(req, res) {
    const {choosenClass} = req.body;
    
}

module.exports = {
    uploadRecords,
    viewRecord
}
