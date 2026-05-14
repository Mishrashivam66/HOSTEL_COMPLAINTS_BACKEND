import transporter from "../config/mail.js";

const sendVerificationEmail = async (

  email,

  token,

  name = "Student"

) => {

  try {

    console.log(
      "Sending verification email to:",
      email
    );

    // =========================
    // VERIFICATION LINK
    // =========================

    const verificationLink =

      `${process.env.CLIENT_URL}/verify-email/${token}`;

    // =========================
    // MAIL OPTIONS
    // =========================

    const mailOptions = {

      from: process.env.EMAIL_USER,

      to: email,

      subject:
        "Verify Your Amity Hostel Account",

      html: `

        <div style="
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background: #f8fafc;
          border-radius: 12px;
        ">

          <h1 style="
            color: #2563eb;
            text-align: center;
          ">

            Amity Hostel ERP

          </h1>

          <h2 style="
            color: #0f172a;
          ">

            Hello ${name},

          </h2>

          <p style="
            font-size: 16px;
            color: #334155;
            line-height: 1.6;
          ">

            Thank you for registering in the
            Amity Hostel Complaint Management System.

          </p>

          <p style="
            font-size: 16px;
            color: #334155;
          ">

            Please click the button below
            to verify your email address.

          </p>

          <div style="
            text-align: center;
            margin: 30px 0;
          ">

            <a
              href="${verificationLink}"

              style="
                background: #2563eb;
                color: white;
                padding: 14px 28px;
                border-radius: 10px;
                text-decoration: none;
                font-weight: bold;
                display: inline-block;
              "
            >

              Verify Email

            </a>

          </div>

          <p style="
            color: #64748b;
            font-size: 14px;
          ">

            This verification link will expire
            in 24 hours.

          </p>

          <hr style="
            margin: 30px 0;
          ">

          <p style="
            text-align: center;
            color: #94a3b8;
            font-size: 13px;
          ">

            Amity University Hostel ERP System

          </p>

        </div>

      `,

    };

    // =========================
    // SEND EMAIL
    // =========================
await transporter.verify();

console.log("SMTP SERVER READY");
    const info =
      await transporter.sendMail(
        mailOptions
      );

    console.log(
      "Verification email sent successfully"
    );

    console.log(info.response);

    return true;

  } catch (error) {

    console.log(
      "EMAIL ERROR:"
    );

    console.log(error);

    return false;

  }

};

export default sendVerificationEmail;