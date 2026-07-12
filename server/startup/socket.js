module.exports = function configureSocket(io) {
  io.on('connection', (socket) => {
    console.log(`Socket conectado: ${socket.id}`);

    socket.on('disconnect', () => {
      console.log(`Socket desconectado: ${socket.id}`);
    });
  });

  return io;
};
