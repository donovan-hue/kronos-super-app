const mongoose = require('mongoose');

// Platillo del menú de un restaurante (delivery). Lo crean los seeds de
// admin.js y seedData.js, y lo consulta el flujo de pedidos de comida.
const menuItemSchema = new mongoose.Schema(
  {
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    name: {
      type: String,
      required: [true, 'El nombre del platillo es obligatorio'],
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    price: {
      type: Number,
      required: [true, 'El precio es obligatorio'],
      min: 0
    },
    category: {
      type: String,
      trim: true,
      default: 'General'
    },
    image: String,
    preparationTime: {
      type: Number, // minutos
      default: 15,
      min: 0
    },
    available: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.models.MenuItem || mongoose.model('MenuItem', menuItemSchema);
