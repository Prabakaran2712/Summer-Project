const Event = require("../../models/eventModel");
const User = require("../../models/userModel");
const mongoose = require("mongoose");
const Joi = require("joi");

const createEvent = async (req, res) => {
  const { error } = validateEvent(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  const {
    eventName,
    eventStartDate,
    eventEndDate,
    venue,
    dept,
    otherInfo,
    contactName,
    contactPhone,
    contactEmail,
    link,
    image,
    public,
  } = req.body;
  try {
    const event = await Event.create({
      eventName,
      eventStartDate,
      eventEndDate,
      venue,
      dept,
      otherInfo,
      contactName,
      contactPhone,
      contactEmail,
      link,
      image,
      public,
      organisers: [req.user.id],
    });
    await User.findByIdAndUpdate(req.user.id, {
      $push: { organizedEvents: event._id },
    });
    return res.status(200).json(event);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const updateEvent = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "No such event" });
  }
  const { error } = validateEvent(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  const newEvent = { ...req.body };
  if (newEvent["image"] === "") {
    newEvent["image"] = null;
  }
  const event = await Event.findOneAndUpdate({ _id: id }, newEvent);
  if (!event) {
    return res.status(400).json({ error: "No such event" });
  }
  res.status(200).json(event);
};

const getEvents = async (req, res) => {
  const events = await Event.find({ public: true })
    .sort({ createdAt: -1 })
    .where("eventEndDate")
    .lt(new Date());
  res.status(200).json(events);
};

const getUpcomingEvents = async (req, res) => {
  const events = await Event.find({ public: true })
    .where("eventEndDate")
    .gte(new Date());
  res.status(200).json(events);
};

const getEvent = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "No such event" });
  }
  const event = await Event.findById(id)
    .populate("organisers")
    .populate("participants");
  if (!event) {
    return res.status(400).json({ error: "No such event" });
  }
  res.status(200).json(event);
};

const checkConflictingEvents = async (req, res) => {
  const { from, to } = req.body;
  const conflictingEvents = await Event.find({})
    .where("eventStartDate")
    .lt(to)
    .where("eventEndDate")
    .gt(from);
  res.status(200).json({
    conflict: conflictingEvents.length ? true : false,
    events: conflictingEvents,
  });
};

const validateEvent = (data) => {
  const schema = Joi.object({
    eventName: Joi.string().required().label("Event name"),
    eventStartDate: Joi.date().required().label("Event startDate"),
    eventEndDate: Joi.date().label("Event end Date"),
    venue: Joi.string().required().label("Venue"),
    dept: Joi.string().empty("").label("Dept"),
    contactName: Joi.string().required().label("Contact name"),
    contactPhone: Joi.string().empty("").label("Contact phone"),
    contactEmail: Joi.string().email().empty("").label("Contact email"),
    otherInfo: Joi.string().empty("").label("Other Info"),
    link: Joi.string().empty("").label("Website Link"),
    image: Joi.string().empty("").label("Event image"),
    public: Joi.bool().label("Visible"),
  });
  return schema.validate(data);
};

module.exports = {
  createEvent,
  getEvents,
  getEvent,
  getUpcomingEvents,
  updateEvent,
  checkConflictingEvents,
};