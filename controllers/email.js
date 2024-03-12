let nodemailer = require('nodemailer');
let handlebars = require('handlebars');
let fs = require('fs').promises;

const emailFunction = (userEmail, verification, type, products, total, orderNo) => {
    let r1;
    if(type && products) {
        let temp = ""
        products.forEach((i, index) => {
            temp = temp + "<br><strong>Product#"+(index+1)+"</strong><br>"+i.title+"<br>Qty:"+i.qty+"<br>Price: "+(i.price*i.qty)+"Rs<br>"
        })
        const orderDetails = "<br><strong>ORDER DETAILS:</strong><br>"+temp+"<br><strong>Total: "+total+"Rs</strong><br><br>"
        const orderDetailz = "<a href=\"https://www.buzzycommerce.com/"+orderNo+"/codeABC12\" style=\"color: #ffffff; text-decoration: none; font-size: .85rem; display: inline-block; width: 11rem;\">ORDER DETAILS</a>"
        r1 = {
            replace1: orderDetails,
            replace2: orderDetailz,
        }
    }
    const smtpTransport = nodemailer.createTransport({
        // service: 'outlook',
        // host: 'smtp-mail.outlook.com',
        // secure: true,
        // port: 587,
        service: 'titan',
        host: 'smtp.titan.email',
        secure: true,
        port: 465,
        auth: {
            // user: 'umarcreator@outlook.com',
            // pass: 'lqqsfmxmcemaethp'
            user: 'umar.farooq@grapners.com',
            pass: 'WeAreGrapners123!'
        }
    });
    const email = async (html) => {
        const template = handlebars.compile(html);
        const r2 = {
            // link: "http://localhost:5173/verify/"+verification
            code: verification
        };
        const replacements = type ? r1 : r2;
        const htmlToSend = template(replacements, { noEscape: true });
        const mailOptions = {
            // from: 'umarcreator@outlook.com',
            from: 'umar.farooq@grapners.com',
            to : userEmail,
            subject : type ? ('Hi, Your Order is Placed Successfully - Order #'+orderNo) : 'Verify Your Account - Buzzy Commerce',
            html : htmlToSend
        };
        try {
            const info = await smtpTransport.sendMail(mailOptions)
            // console.log('email sent: ', info);
            return true;
        } catch (error) {
            // console.log('Error in Sending Email: ', error);
            return false;
        }
    }
    async function readData() {
        const mailHtml = type ? 'assets/mailer2.html' : 'assets/mailer.html'
        const data = await fs.readFile(mailHtml, {encoding: 'utf-8'})
        const result = await email(data);
        return result;
    }
    const result = readData();
    return result;
}

module.exports = emailFunction;