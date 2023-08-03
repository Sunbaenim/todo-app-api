import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: false },
    createdAt: { type: Date, required: true, default: new Date() },
    isFinished: { type: Boolean, required: false, default: false },
    finishedAt: { type: Date, required: false }
});

taskSchema.pre('updateOne', function (next) {
    if (this._conditions.isFinished === this._update.isFinished) {
        next();
        return;
    }
    if (this._update.isFinished) {
        this._update.finishedAt = new Date();
    } else {
        this._update.finishedAt = null;
    }
    next();
});

const Task = mongoose.model('Task', taskSchema);

export default Task;