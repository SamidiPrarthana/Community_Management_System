const QRCode = require("qrcode");

const generateQR = async (data) => {
    try {
        const qrImage = await QRCode.toDataURL(data);
        return qrImage;
    } catch (err) {
        throw err;
    }
};

module.exports = generateQR;