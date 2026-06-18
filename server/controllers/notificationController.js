const Notification = require('../models/Notification');

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('sender', 'username avatar');
    const unreadCount = await Notification.countDocuments({ recipient: req.user._id, read: false });
    res.json({ notifications, unreadCount });
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener notificaciones' });
  }
};

exports.markAllRead = async (req, res) => {
  try {
    await Notification.updateMany({ recipient: req.user._id, read: false }, { read: true });
    res.json({ message: 'Notificaciones marcadas como leídas' });
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar notificaciones' });
  }
};

exports.markOneRead = async (req, res) => {
  try {
    const result = await Notification.updateOne(
      { _id: req.params.id, recipient: req.user._id },
      { $set: { read: true } }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Notificación no encontrada' });
    }
    res.json({ message: 'OK' });
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar notificación' });
  }
};

exports.createNotification = async ({ recipient, sender, type, title, body = '', link = '', meta = {} }) => {
  try {
    if (recipient?.toString() === sender?.toString()) return null;
    return await Notification.create({ recipient, sender, type, title, body, link, meta });
  } catch (err) {
    console.error('Error silencioso al crear notificación:', err);
    return null;
  }
};
