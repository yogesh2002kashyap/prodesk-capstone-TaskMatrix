const { GoogleGenerativeAI } = require('@google/generative-ai');
const { sendSuccess, sendError } = require('../utils/apiError');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const suggestSubtasks = async (req, res, next) => {
    try{
    const { teskTitle } = req.body;

    const model = getAI.getGenerativeModel({model: 'gemini-.5-flash'});

    const prompt = `You are a project management assistant for a software engineering team.
    
Given this task title: "${taskTitle}"

Generate exactly 5 clear, actionable subtasks that a developer would need to complete this task. 

Respond ONLY with a valid JSON array of strings. No explanation, no markdown, no extra text. Example format:
["Subtask 1", "Subtask 2", "Subtask 3", "Subtask 4", "Subtask 5"]`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    let subtasks;
    try{
        subtasks = JSON.parse(text);
        if(!Array.isArray(subtasks)){
            throw new Error('Not an Array');
        }
        subtasks = subtasks.filter(item => typeof item === 'string').slice(0,5);
    }catch(parseErr){
        return sendError(res, 500, 'AI returned an unexpected response formate');
    }
    return sendSuccess(res, 200, { subtasks}, 'Subtasks generated');
    } catch(err) {
        next(err);  
    }
};

module.exports = { suggestSubtasks };