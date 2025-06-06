// backend/utils/emailService.js
import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();

// Configura SendGrid con la tua API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Invia un'email di conferma all'utente registrato
 * @param {Object} user - Oggetto utente con email e token di conferma
 * @returns {Promise} - Promise che si risolve quando l'email è stata inviata
 */
export const sendConfirmationEmail = async (user) => {
  const confirmationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${user.confirmationToken}`;
  
  const msg = {
    to: user.email,
    from: process.env.EMAIL_FROM || 'ivanfucchi@gmail.com', // Email verificata in SendGrid
    subject: 'Conferma la tua email - MUSA App',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Benvenuto su MUSA!</h2>
        <p>Grazie per esserti registrato. Per completare la registrazione e attivare il tuo account, clicca sul pulsante qui sotto:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${confirmationUrl}" style="background-color: #4CAF50; color: white; padding: 14px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 4px; font-weight: bold;">
            Conferma la tua email
          </a>
        </div>
        <p>Se non hai creato tu questo account, puoi ignorare questa email.</p>
        <p>Grazie,<br>Il team di MUSA</p>
      </div>
    `
  };

  
  
  try {
    await sgMail.send(msg);
    console.log(`Email di conferma inviata a ${user.email}`);
    return true;
  } catch (error) {
    console.error('Errore nell\'invio dell\'email di conferma:', error);
    if (error.response) {
      console.error(error.response.body);
    }
    return false;
  }
};

/**
 * Invia un'email di reset password
 * @param {Object} user - Oggetto utente con email e token di reset
 * @returns {Promise} - Promise che si risolve quando l'email è stata inviata
 */
export const sendPasswordResetEmail = async (user) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${user.resetPasswordToken}`;
  
  const msg = {
    to: user.email,
    from: process.env.EMAIL_FROM || 'noreply@musaapp.com',
    subject: 'Reset della password - MUSA App',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Reset della password</h2>
        <p>Hai richiesto il reset della password. Clicca sul pulsante qui sotto per impostare una nuova password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 14px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 4px; font-weight: bold;">
            Reset Password
          </a>
        </div>
        <p>Se non hai richiesto tu il reset della password, puoi ignorare questa email.</p>
        <p>Grazie,<br>Il team di MUSA</p>
      </div>
    `
  };
  
  try {
    await sgMail.send(msg);
    console.log(`Email di reset password inviata a ${user.email}`);
    return true;
  } catch (error) {
    console.error('Errore nell\'invio dell\'email di reset password:', error);
    if (error.response) {
      console.error(error.response.body);
    }
    return false;
  }
};

export default {
  sendConfirmationEmail,
  sendPasswordResetEmail
};
