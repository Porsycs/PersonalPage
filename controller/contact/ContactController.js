const express = require('express');
const nodemailer = require('nodemailer');
const router =  express.Router();

router.get('/contact', async (req, res) => {
    try {
        res.render("contact/contact")
    }catch (err) {
        res.status(500).send('Erro ao acessar a página de contato');
    }
  });
  
router.post('/contact-send', async (req, res) => {
    var {name,email,message} = req.body;
  
    // Configurar email
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    const mailOptions = {
        from: email,
        to: process.env.EMAIL_USER,
        subject: 'Novo contato do formulário',
        text: `Nome: ${name}\nE-mail: ${email}\n\nMensagem:\n${message}`
      };
    
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return res.status(500).json({ success: false });
        }
        res.json({ success: true });
    })
    });

    module.exports = router;