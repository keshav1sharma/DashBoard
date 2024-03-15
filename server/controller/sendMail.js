import nodemailer from "nodemailer";
import puppeteer from "puppeteer";
import html_to_pdf from 'html-pdf-node';

export const sendMarkSheet = async (req, res) => {
  try {
    const { students } = req.body;
    console.log(students);
    if (!students || students.length === 0) {
      return res.status(400).json({ message: "No student data provided" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      secure: true,
      port: 465,
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASS,
      },
    });

    await Promise.all(
      students.map(async (student) => {
        const { name, email, rollNo, marks, totalMarks } = student;
        console.log(email);
        const mailContent = `
            <p>Dear ${name},</p>
            <p>Your marks for the evaluation are as follows:</p>
            <p>Ideation: ${marks.ideation}</p>
            <p>Execution: ${marks.execution}</p>
            <p>Viva: ${marks.viva}</p>
            <p>Total Marks: ${totalMarks}</p>
            <p>Thank you!</p>
        `;
        const htmlContent = `
        <!DOCTYPE html>
<html>
<head>
    <style type='text/css'>
        body, html {
            margin: 0;
            padding: 0;
        }
        body {
            color: black;
            font-family: Georgia, serif;
            font-size: 18px;
            text-align: center;
    
        }
        table {
            margin: 40px auto; /* Center the table horizontally */
            border-collapse: collapse;
            width: 95%;
            background-color: #f2f2f2; /* Light grey background */
            border: 3px solid #333; /* Dark grey border */
        }
        th, td {
            border: 2px solid #333; /* Dark grey border */
            padding: 20px;
        }
        th {
            background-color: #666; /* Dark grey header */
            color: white; /* White text */
        }
        .container {
            margin: 40px auto;
            width: 80%;
            text-align: left;
        }
        .marquee {
            color: #666; /* Dark grey color */
            font-size: 32px;
            margin: 20px;
        }
        .assignment {
            margin: 20px;
        }
        .person {
            font-size: 20px;
            font-style: italic;
            margin: 20px 0;
        }
        .total {
            font-size: 22px;
            font-weight: bold;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">

        <div class="marquee">
            Marksheet
        </div>

        <div class="assignment">
            <div class="person">
                Name: ${name}
            </div>
            <div class="person">
                Roll No: ${rollNo}
            </div>
        </div>

        <table>
            <thead>
                <tr>
                    <th>Subject</th>
                    <th>Marks</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Ideation</td>
                    <td>${marks.ideation}</td>
                </tr>
                <tr>
                    <td>Execution</td>
                    <td>${marks.execution}</td>
                </tr>
                <tr>
                    <td>Viva</td>
                    <td>${marks.viva}</td>
                </tr>
            </tbody>
        </table>

        <div class="total"> Total Marks: ${totalMarks}</div>
    </div>
</body>
</html>

        `;

        // const browser = await puppeteer.launch();
        // const page = await browser.newPage();
        // await page.setContent(htmlContent);
        // const pdfBuffer = await page.pdf({ format: "Letter", landscape: true });
        // await browser.close();
        const pdfBuffer = await html_to_pdf.generatePdf({ content: htmlContent }, { format: "A4" });

        await transporter.sendMail({
          from: process.env.USER_PASS,
          to: email,
          subject: `${name} Check your evaluated results`,
          html: mailContent,
          attachments: [
            {
              filename: "marksheet.pdf",
              content: pdfBuffer,
            },
          ],
        });
      })
    );
    console.log("Emails sent successfully");
    res.status(200).json({ message: "Marksheet emails sent successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};