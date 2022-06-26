const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const EMAIL_TEMPLATE = {
    CONFIRM_KYC: "d-f8a51f677fe843a485bbfbac48b1684e",
    WHITELIST_SUCCESS: "d-5e332489958547e38e5e2e9a1e37ae2a",
    SUBSCRIBE: "d-41775c81e11a4c2f8a0a82b46e7f946c"
};
  
const sendEmail = (
    toEmail,
    templateId,
    dynamicTemplateData,
) => {
    const msg = {
      to: toEmail,
      from: 'dreamlauncher.ido@gmail.com',
      templateId,
      dynamicTemplateData,
    };
    return sgMail.send(msg);
};

const sendConfirmSubscirbeEmail = async (email) => {
    await sendEmail(email,EMAIL_TEMPLATE.SUBSCRIBE);
}

module.exports = {
    sendConfirmSubscirbeEmail,
}