const Notice = require('../models/noticeSchema.js');
const Admin = require('../models/adminSchema.js');
const mongoose = require("mongoose");

const noticeCreate = async (req, res) => {
    try {

        console.log(req.user);
        
        // Check mongodb ID format
        if (!mongoose.Types.ObjectId.isValid(req.body.adminID)) {
            return res.status(400).json({ data: "Invalid admin ID" });
        }

        // Check is admin
        const admin = await Admin.findById(req.body.adminID);
        if (!admin) {
            return res.status(403).json({ data: "Unauthorized" });
        }

        const notice = new Notice({
            ...req.body,
            school: req.body.adminID
        })
        const result = await notice.save()
        res.send(result)
        
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};

const noticeList = async (req, res) => {
    try {
        let notices = await Notice.find({ school: req.params.id })
        if (notices.length > 0) {
            res.send(notices)
        } else {
            res.send({ message: "No notices found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const updateNotice = async (req, res) => {
    try {
        const result = await Notice.findByIdAndUpdate(req.params.id,
            { $set: req.body },
            { new: true })
        res.send(result)
    } catch (error) {
        res.status(500).json(error);
    }
}

const deleteNotice = async (req, res) => {
    try {
        const result = await Notice.findByIdAndDelete(req.params.id)
        res.send(result)
    } catch (error) {
        res.status(500).json(err);
    }
}

const deleteNotices = async (req, res) => {
    try {
        const result = await Notice.deleteMany({ school: req.params.id })
        if (result.deletedCount === 0) {
            res.send({ message: "No notices found to delete" })
        } else {
            res.send(result)
        }
    } catch (error) {
        res.status(500).json(err);
    }
}

module.exports = { noticeCreate, noticeList, updateNotice, deleteNotice, deleteNotices };