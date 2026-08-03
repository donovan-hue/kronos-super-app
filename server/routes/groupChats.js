const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const ctrl = require('../controllers/groupChatController');

router.get('/', protect, ctrl.getMyGroups);
router.post('/', protect, ctrl.createGroup);
router.get('/:id', protect, ctrl.getGroupInfo);
router.get('/:id/messages', protect, ctrl.getGroupMessages);
router.post('/:id/messages', protect, ctrl.sendMessage);
router.post('/:id/members', protect, ctrl.addMembers);
router.delete('/:id/leave', protect, ctrl.leaveGroup);

module.exports = router;
