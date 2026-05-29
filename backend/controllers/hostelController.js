const HostelRoom = require("../models/HostelRoom");
const HostelStudent = require("../models/HostelStudent");

// @desc    Get all hostel rooms
// @route   GET /api/hostel/rooms
// @access  Public
exports.getHostelRooms = async (req, res) => {
  try {
    const { hostelType, roomType, available } = req.query;
    let query = {};

    if (hostelType) query.hostelType = hostelType;
    if (roomType) query.roomType = roomType;
    if (available === "true") query.availableBeds = { $gt: 0 };

    const rooms = await HostelRoom.find(query).populate(
      "studentsAssigned",
      "studentName studentClass",
    );

    res.status(200).json({
      success: true,
      count: rooms.length,
      data: rooms,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get hostel availability statistics
// @route   GET /api/hostel/stats
// @access  Public
exports.getHostelStats = async (req, res) => {
  try {

    const rooms = await HostelRoom.find();

    const availability = {
      boys: {
        ac: 0,
        nonAc: 0
      },
      girls: {
        ac: 0,
        nonAc: 0
      }
    };

    rooms.forEach((room) => {

      if (room.hostelType === 'Boys') {

        if (room.roomType === 'AC') {
          availability.boys.ac += room.availableBeds;
        } else {
          availability.boys.nonAc += room.availableBeds;
        }

      } else if (room.hostelType === 'Girls') {

        if (room.roomType === 'AC') {
          availability.girls.ac += room.availableBeds;
        } else {
          availability.girls.nonAc += room.availableBeds;
        }
      }

    });

    res.status(200).json({
      success: true,
      data: availability
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      error: err.message
    });

  }
};
// @desc    Assign student to a room
// @route   POST /api/hostel/assign
// @access  Private (Admin)
exports.assignStudentToRoom = async (req, res) => {
  try {
    const { studentId, roomId } = req.body;

    const room = await HostelRoom.findById(roomId);
    if (!room) {
      return res.status(404).json({ success: false, error: "Room not found" });
    }

    if (room.availableBeds <= 0) {
      return res
        .status(400)
        .json({ success: false, error: "No beds available in this room" });
    }

    const student = await HostelStudent.findById(studentId);
    if (!student) {
      return res
        .status(404)
        .json({ success: false, error: "Student not found" });
    }

    // Update Room
    room.studentsAssigned.push(studentId);
    room.occupiedBeds += 1;
    await room.save();

    // Update Student
    student.hostelDetails = {
      room: roomId,
      roomNumber: room.roomNumber,
      hostelType: room.hostelType,
      roomType: room.roomType,
      admissionDate: new Date(),
    };
    await student.save();

    res.status(200).json({
      success: true,
      message: `Student ${student.studentName} assigned to room ${room.roomNumber}`,
      data: room,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
