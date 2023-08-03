import Task from '../models/task.js';

const createTask = async (req, res) => {
    try {
        const { title, description } = req.body;
        if (!title || !title.trim()) {
            return res.status(404).json({ success: false, error: 'The title is required' });
        }
        const newTask = await Task.create({ title, description });
        res.status(201).json({ success: true, data: newTask });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

const getTimeElapsed = (start, end) => {
    const timeDifference = Math.abs(end - start);
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
    let minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
    if (minutes < 1) minutes = 1;
    return { days, hours, minutes };
}

const getAllTasks = async (req, res) => {
    try {
        const { isFinished } = req.query;
        let tasks;
        
        if (isFinished === 'false') {
            tasks = await Task.find({ isFinished: false });
            tasks = tasks.map(task => {
                const { id, title, description, isFinished, createdAt } = task;
                return { id, title, description, isFinished, createdAt };
            });
        } else if (isFinished === 'true') {
            tasks = await Task.find({ isFinished: true });
            tasks = tasks.map(task => {
                const { id, title, description, isFinished, createdAt, finishedAt } = task;
                const timeElapsed = getTimeElapsed(createdAt, finishedAt);
                return { id, title, description, isFinished, createdAt, finishedAt, timeElapsed }
            });
        } else {
            tasks = await Task.find();
        }
        res.status(200).json({ success: true, data: tasks });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

const getTaskById = async (req, res) => {
    try {
        let task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json( {success: false, error: `No tasks with id ${req.params.id} were found`} );
        }
        if (task.finishedAt) {
            const timeElapsed = getTimeElapsed(task.createdAt, task.finishedAt);
            task = {...task.toObject(), timeElapsed: timeElapsed};
        }
        res.status(200).json({ success: true, data: task });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json( {success: false, error: `No tasks with id ${req.params.id} were found`} );
        }
        const updatedTask = await Task.updateOne(task, req.body);
        await task.save();
        res.status(200).json({success: false, data: updatedTask });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json( {success: false, error: `No tasks with id ${req.params.id} were found`} );
        }
        await Task.deleteOne(task);
        res.status(200).json({ success: true, data: task });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

export { createTask, getAllTasks, getTaskById, updateTask, deleteTask };