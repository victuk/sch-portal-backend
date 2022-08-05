const { usersDB } = require("../../models/usersModel");
const { admissionMessage } = require("../../models/admissionMessageModel");

async function loadNewStudents(req, res) {
    const newStudents = await usersDB.find({
        admitted: false
    });

    res.send(newStudents);
}

async function approveAdmission(req, res) {
    const {studentID} = req.params;

    await usersDB.findByIdAndUpdate(studentID, {
        admitted: true
    });

    res.json({
        message: "Admitted."
    });
}

async function deleteAdmission(req, res) {
    const {studentID} = req.params;
    await usersDB.findByIdAndDelete(studentID);
    res.json({
        message: "Deleted."
    });
}

async function getAdmissionMessage(req, res) {
    const message = await admissionMessage.find();

    res.send(message);
}

async function setAdmissionMessage(req, res) {
    const {
        message,
        admissionStartDate,
        admissionEndDate,
        year
    } = req.body;

    const admissionMessageCount = await admissionMessage.count();
    if (admissionMessageCount != 0) {
        res.status(400).json({
            message: "Delete or edit the already existing admission information."
        });
    } else {
        try {
            await admissionMessage.create({
                message,
                admissionStartDate,
                admissionEndDate,
                year
            });
    
            res.json({
                message: "Admission information posted successfully."
            });  
        } catch (error) {
            res.status(500).json({
                message: "Server error occurred."
            });  
        }
        
    }
}

async function editAdmissionMessage(req, res) {
    const {id} = req.params;
    const {
        message,
        admissionStartDate,
        admissionEndDate,
        year 
    } = req.body;

    try {
        await admissionMessage.findByIdAndUpdate(id, {
            message,
            admissionStartDate,
            admissionEndDate,
            year   
        });

        res.json({
            message: "Admission information updated successfully."
        }); 
    } catch (error) {
        res.status(500).json({
            message: "Server error occurred."
        }); 
    }
}

async function deleteAdmissionMessage(req, res) {
    const {id} = req.params;

    try {
        await admissionMessage.findByIdAndDelete(id);
        res.json({
            message: "Admission information deleted successfully."
        }); 
    } catch (error) {
        res.status(500).json({
            message: "Server error occurred."
        }); 
    }
    
}

module.exports = {
    loadNewStudents,
    approveAdmission,
    deleteAdmission,
    getAdmissionMessage,
    setAdmissionMessage,
    editAdmissionMessage,
    deleteAdmissionMessage
};
