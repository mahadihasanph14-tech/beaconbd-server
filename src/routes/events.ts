import { Router } from "express";
import { getDB, ObjectId } from "../db.js";
import { requireAuth, type AuthRequest } from "../auth.js";

const router = Router();
const validTypes = ["Cleanup", "Plantation", "Donation", "Education", "Health", "Other"];

function getEventId(id: string | string[] | undefined) {
return Array.isArray(id) ? id[0] : id;
}

function cleanEvent(body: any) {
return {
title: String(body.title || "").trim(),
description: String(body.description || "").trim(),
type: String(body.type || ""),
image: String(body.image || "").trim(),
location: String(body.location || "").trim(),
date: new Date(body.date)
};
}

function validateEvent(event: ReturnType<typeof cleanEvent>) {
if (event.title.length < 5) return "Title must be at least 5 characters.";
if (event.description.length < 20) return "Description must be at least 20 characters.";
if (!validTypes.includes(event.type)) return "Invalid event type.";
if (!event.image.startsWith("http")) return "A valid image URL is required.";
if (!event.location) return "Location is required.";
if (Number.isNaN(event.date.getTime()) || event.date <= new Date()) return "Event date must be in the future.";
return null;
}

router.get("/", async (req, res) => {
const limit = Math.min(Math.max(Number(req.query.limit) || 0, 0), 50);
const query = { date: { $gt: new Date() } };
const cursor = getDB().collection("events").find(query).sort({ date: 1 });
if (limit) cursor.limit(limit);
const events = await cursor.toArray();
res.json({ data: events });
});

router.get("/mine", requireAuth, async (req: AuthRequest, res) => {
const events = await getDB().collection("events").find({ creatorEmail: req.user!.email }).sort({ date: 1 }).toArray();
res.json({ data: events });
});

router.get("/joined", requireAuth, async (req: AuthRequest, res) => {
const joins = await getDB().collection("joins").find({ userEmail: req.user!.email }).sort({ eventDate: 1 }).toArray();
const ids = joins.map(j => new ObjectId(j.eventId));
const events = ids.length
? await getDB().collection("events").find({ _id: { $in: ids } }).sort({ date: 1 }).toArray()
: [];
res.json({ data: events });
});

router.get("/:id", async (req, res) => {
const id = getEventId(req.params.id);
if (!id || !ObjectId.isValid(id)) {
return res.status(400).json({ message: "Invalid event id." });
}

const event = await getDB().collection("events").findOne({ _id: new ObjectId(id) });
if (!event) return res.status(404).json({ message: "Event not found." });

const participants = await getDB().collection("joins").countDocuments({ eventId: event._id.toString() });
res.json({ data: { ...event, participants } });
});

router.post("/", requireAuth, async (req: AuthRequest, res) => {
const event = cleanEvent(req.body);
const error = validateEvent(event);
if (error) return res.status(400).json({ message: error });

const doc = {
...event,
creatorEmail: req.user!.email!,
creatorName: req.user!.name || "",
createdAt: new Date(),
updatedAt: new Date()
};

const result = await getDB().collection("events").insertOne(doc);
res.status(201).json({ data: { ...doc, _id: result.insertedId } });
});

router.post("/:id/join", requireAuth, async (req: AuthRequest, res) => {
const id = getEventId(req.params.id);
if (!id || !ObjectId.isValid(id)) {
return res.status(400).json({ message: "Invalid event id." });
}

const event = await getDB().collection("events").findOne({
_id: new ObjectId(id),
date: { $gt: new Date() }
});

if (!event) return res.status(404).json({ message: "Upcoming event not found." });

try {
await getDB().collection("joins").insertOne({
eventId: event._id.toString(),
userEmail: req.user!.email!,
userName: req.user!.name || "",
eventTitle: event.title,
eventDate: event.date,
joinedAt: new Date()
});

res.status(201).json({ message: "Joined successfully." });

} catch (error: any) {
if (error?.code === 11000) {
return res.status(409).json({ message: "You already joined this event." });
}
throw error;
}
});

router.patch("/:id", requireAuth, async (req: AuthRequest, res) => {
const id = getEventId(req.params.id);
if (!id || !ObjectId.isValid(id)) {
return res.status(400).json({ message: "Invalid event id." });
}

const event = cleanEvent(req.body);
const error = validateEvent(event);
if (error) return res.status(400).json({ message: error });

const result = await getDB().collection("events").updateOne(
{ _id: new ObjectId(id), creatorEmail: req.user!.email },
{ $set: { ...event, updatedAt: new Date() } }
);

if (!result.matchedCount) {
return res.status(403).json({ message: "You can only update your own events." });
}

res.json({ message: "Event updated successfully." });
});

router.delete("/:id", requireAuth, async (req: AuthRequest, res) => {
const id = getEventId(req.params.id);
if (!id || !ObjectId.isValid(id)) {
return res.status(400).json({ message: "Invalid event id." });
}

const filter = { _id: new ObjectId(id), creatorEmail: req.user!.email };
const result = await getDB().collection("events").deleteOne(filter);

if (!result.deletedCount) {
return res.status(403).json({ message: "You can only delete your own events." });
}

await getDB().collection("joins").deleteMany({ eventId: id });
res.json({ message: "Event deleted successfully." });
});

export default router;
