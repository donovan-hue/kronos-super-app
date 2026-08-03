const aiService = require('../services/aiService');

const handleAIError = (res, error) => {
  if (error.message.includes('not initialized')) {
    return res.status(503).json({ message: 'Servicio de IA no configurado. Agrega OPENAI_API_KEY en .env' });
  }
  if (error.status === 429) {
    return res.status(429).json({ message: 'Limite de IA alcanzado. Intenta en unos segundos.' });
  }
  console.error('AI error:', error.message);
  res.status(500).json({ message: 'Error en el servicio de IA' });
};

exports.generateCaption = async (req, res) => {
  try {
    const { prompt, style, language } = req.body;
    if (!prompt) return res.status(400).json({ message: 'prompt is required' });
    const caption = await aiService.generateCaption(prompt, style || 'casual', language || 'es');
    res.json({ caption });
  } catch (error) { handleAIError(res, error); }
};

exports.generateImage = async (req, res) => {
  try {
    const { prompt, size } = req.body;
    if (!prompt) return res.status(400).json({ message: 'prompt is required' });
    // Calidad por plan del producto "media": premium/pro → HD, resto → standard.
    const mediaPlan = req.user?.productPlans?.media || 'free';
    const quality = ['premium', 'pro'].includes(mediaPlan) ? 'hd' : 'standard';
    const imageUrl = await aiService.generateImage(prompt, size || '1024x1024', quality);
    res.json({ imageUrl });
  } catch (error) { handleAIError(res, error); }
};

exports.generateImageVariants = async (req, res) => {
  try {
    const { prompt, count } = req.body;
    if (!prompt) return res.status(400).json({ message: 'prompt is required' });
    const urls = await aiService.generateImageVariants(prompt, Math.min(count || 2, 4));
    res.json({ urls });
  } catch (error) { handleAIError(res, error); }
};

exports.analyzeSentiment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'text is required' });
    const analysis = await aiService.analyzeSentiment(text);
    res.json({ analysis });
  } catch (error) { handleAIError(res, error); }
};

exports.generateProductDescription = async (req, res) => {
  try {
    const { productName, category, features } = req.body;
    if (!productName || !category) return res.status(400).json({ message: 'productName and category are required' });
    const description = await aiService.generateProductDescription(productName, category, features || []);
    res.json({ description });
  } catch (error) { handleAIError(res, error); }
};

exports.generateHashtags = async (req, res) => {
  try {
    const { content, count } = req.body;
    if (!content) return res.status(400).json({ message: 'content is required' });
    const hashtags = await aiService.generateHashtags(content, count || 10);
    res.json({ hashtags });
  } catch (error) { handleAIError(res, error); }
};

// Modelo según el plan del producto "scripts": premium/pro usan gpt-4o (mejor
// calidad), free/estandar usan gpt-4o-mini (más barato). Así se monetiza la calidad.
const PREMIUM_TEXT_PLANS = ['premium', 'pro'];
const modelForScriptsPlan = (req) => {
  const plan = req.user?.productPlans?.scripts || 'free';
  return PREMIUM_TEXT_PLANS.includes(plan) ? 'gpt-4o' : 'gpt-4o-mini';
};

exports.chat = async (req, res) => {
  try {
    const { messages, systemPrompt } = req.body;
    if (!messages || !Array.isArray(messages)) return res.status(400).json({ message: 'messages array is required' });
    const reply = await aiService.chatWithAssistant(messages, systemPrompt, { model: modelForScriptsPlan(req) });
    res.json({ reply });
  } catch (error) { handleAIError(res, error); }
};

exports.generateStory = async (req, res) => {
  try {
    const { premise, genre, choices } = req.body;
    if (!premise) return res.status(400).json({ message: 'premise is required' });
    const story = await aiService.generateStoryScript(premise, genre || 'aventura', choices || 3);
    res.json({ story });
  } catch (error) { handleAIError(res, error); }
};
