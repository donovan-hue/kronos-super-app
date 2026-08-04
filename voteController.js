const Vote = require('../models/Vote');
const Post = require('../models/Post');

exports.castVote = async (req, res, next) => {
  try {
    const { targetId, targetType, voteType } = req.body;
    const userId = req.user.id;

    if (!['Post', 'Comment', 'Story', 'Listing'].includes(targetType)) {
      return res.status(400).json({ success: false, message: 'Tipo de entidad no válido.' });
    }

    const existingVote = await Vote.findOne({ userId, targetId, targetType });

    let action = 'created';
    let deltaUp = 0;
    let deltaDown = 0;

    if (existingVote) {
      if (existingVote.voteType === voteType) {
        // Remover voto si vuelve a presionar el mismo
        await Vote.deleteOne({ _id: existingVote._id });
        action = 'removed';
        if (voteType === 'upvote') deltaUp = -1;
        if (voteType === 'downvote') deltaDown = -1;
      } else {
        // Cambiar el tipo de voto (ej. de downvote a upvote)
        const oldType = existingVote.voteType;
        existingVote.voteType = voteType;
        await existingVote.save();
        action = 'updated';

        if (oldType === 'upvote') deltaUp -= 1;
        if (oldType === 'downvote') deltaDown -= 1;
        if (voteType === 'upvote') deltaUp += 1;
        if (voteType === 'downvote') deltaDown += 1;
      }
    } else {
      // Crear nuevo voto
      await Vote.create({ userId, targetId, targetType, voteType });
      if (voteType === 'upvote') deltaUp = 1;
      if (voteType === 'downvote') deltaDown = 1;
    }

    // Actualizar contadores en la entidad destino (ejemplo en Post)
    let updatedTarget = null;
    if (targetType === 'Post') {
      updatedTarget = await Post.findByIdAndUpdate(
        targetId,
        {
          $inc: { upvotesCount: deltaUp, downvotesCount: deltaDown }
        },
        { new: true }
      );
    }

    // Emitir evento en tiempo real vía Socket.io si la instancia está configurada
    const io = req.app.get('io');
    if (io) {
      io.emit('vote_updated', {
        targetId,
        targetType,
        action,
        upvotesCount: updatedTarget ? updatedTarget.upvotesCount : 0,
        downvotesCount: updatedTarget ? updatedTarget.downvotesCount : 0
      });
    }

    return res.status(200).json({
      success: true,
      action,
      upvotesCount: updatedTarget ? updatedTarget.upvotesCount : 0,
      downvotesCount: updatedTarget ? updatedTarget.downvotesCount : 0
    });
  } catch (error) {
    next(error);
  }
};

