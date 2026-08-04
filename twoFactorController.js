const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.generate2FASecret = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado.' });
    }

    // Generar secreto TOTP
    const secret = speakeasy.generateSecret({
      name: `KronosApp (${user.email})`
    });

    // Guardar el secreto de forma temporal (no habilitado hasta verificar token)
    user.tempTwoFactorSecret = secret.base32;
    await user.save();

    // Generar código QR en formato data URL para la interfaz
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

    return res.status(200).json({
      success: true,
      qrCodeUrl,
      secret: secret.base32
    });
  } catch (error) {
    next(error);
  }
};

exports.verifyAndEnable2FA = async (req, res, next) => {
  try {
    const { token } = req.body;
    const user = await User.findById(req.user.id);

    if (!user || !user.tempTwoFactorSecret) {
      return res.status(400).json({ success: false, message: 'Solicitud de 2FA no iniciada.' });
    }

    // Verificar el código de 6 dígitos generado por la app autenticadora
    const verified = speakeasy.totp.verify({
      secret: user.tempTwoFactorSecret,
      encoding: 'base32',
      token,
      window: 1 // Permite un margen de tiempo de +-30 segundos
    });

    if (!verified) {
      return res.status(400).json({ success: false, message: 'Código 2FA incorrecto o expirado.' });
    }

    // Activar 2FA de forma definitiva
    user.twoFactorSecret = user.tempTwoFactorSecret;
    user.tempTwoFactorSecret = undefined;
    user.isTwoFactorEnabled = true;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Autenticación de dos factores activada correctamente.'
    });
  } catch (error) {
    next(error);
  }
};

exports.verify2FALogin = async (req, res, next) => {
  try {
    const { userId, token } = req.body;
    const user = await User.findById(userId);

    if (!user || !user.isTwoFactorEnabled) {
      return res.status(400).json({ success: false, message: '2FA no configurado para este usuario.' });
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token,
      window: 1
    });

    if (!verified) {
      return res.status(401).json({ success: false, message: 'Código 2FA inválido.' });
    }

    // Emitir tokens JWT reales tras la verificación exitosa
    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      success: true,
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

