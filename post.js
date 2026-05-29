const express = require("express")
const { readFile } = require("fs")
const app = express()
const fs = require("fs/promises")
const nodemailer = require("nodemailer")
const sender = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "cssflows@gmail.com",
    pass: "qrxw ljnf fxca mgnx"
  }
})
app.use(express.json())

const cors = require("cors");
app.use(cors());

// app.use((req, res, next) => {
//     req.body.middleware = "this line is added using middleware"
//     next()
// })

app.post("/signup", async (req, res) => {
  try {
    const data = await fs.readFile("./database/users.json", "utf-8")
    const users = JSON.parse(data)
    const NewUser = req.body


    if (!NewUser.Name || !NewUser.Email || !NewUser.Password || !NewUser.Phone) {
      res.json({ "Message": "More Details Required" })
      return
    }
    else {

      const alreadyUser = users.find(
        user => user.Email === NewUser.Email
      );

      if (alreadyUser) {

        return res.json({
          Message: "Email already exists"
        });

      }

      users.push(NewUser);

      const NewData = JSON.stringify(users, null, 2);

      await fs.writeFile("./database/users.json", NewData);

      res.json({
        Message: "Signed Up Successfully"
      });

    }

  } catch (error) {
    console.log(error)
  }
})

app.post("/login", async (req, res) => {
  try {

    const UsersData = await fs.readFile("./database/users.json", "utf-8");

    const userArr = JSON.parse(UsersData);

    const { Email, Password } = req.body;

   
    const ExistingUser = userArr.find(
      user => user.Email === Email
    );

    if (!ExistingUser) {

      return res.status(404).json({
        Message: "Email doesn't exist"
      });

    }

    if (ExistingUser.Password !== Password) {

      return res.status(401).json({
        Message: "Wrong Password"
      });

    }


    return res.status(200).json({
      Message: "Logged In Successfully"
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      Message: "Server Error"
    });

  }
});

app.post("/forget_password", async (req, res) => {
  try {
    const UsersData = await fs.readFile("./database/users.json", "utf-8")
    const userArr = JSON.parse(UsersData)
    const { mail } = req.body
    const OTP = Math.floor(100000 + Math.random() * 900000)
    const ExistingUser = userArr.find(user => user.Email === mail)

    if (ExistingUser) {

      ExistingUser.OTP = OTP
      const NewData = JSON.stringify(userArr, null, 2)
      await fs.writeFile("./database/users.json", NewData)
      const phone = ExistingUser.Phone
      const template = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Password Reset</title>
    </head>

    <body style="margin:0; padding:0; background-color:#f4f4f4; font-family:Arial, sans-serif;">

      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4; padding:40px 0;">
        <tr>
          <td align="center">

            <table width="600" cellpadding="0" cellspacing="0" 
              style="background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.1);">


              <tr>
                <td align="center" 
                  style="background:#111827; color:#ffffff; padding:30px;">
                  <h1 style="margin:0; font-size:28px;">Password Reset</h1>
                </td>
              </tr>


              <tr>
                <td style="padding:40px 35px; color:#333333;">

                  <h2 style="margin-top:0; font-size:22px;">
                    Hello, ${ExistingUser.Name}
                  </h2>

                  <p style="font-size:16px; line-height:1.6;">
                    We received a request to reset your password.
                    Use the OTP below to continue:
                  </p>


                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center" style="padding:30px 0;">
                        <div style="
                          display:inline-block;
                          background:#f3f4f6;
                          padding:18px 35px;
                          border-radius:10px;
                          font-size:32px;
                          font-weight:bold;
                          letter-spacing:8px;
                          color:#111827;
                        ">
                          ${ExistingUser.OTP}
                        </div>
                      </td>
                    </tr>
                  </table>



                  <p style="font-size:15px; line-height:1.6; color:#555;">
                    If you did not request a password reset, you can safely ignore this email.
                  </p>

                  <p style="margin-top:30px; font-size:15px;">
                    Regards,<br>
                    <strong>Your Company Team</strong>
                  </p>

                </td>
              </tr>

              <tr>
                <td align="center"
                  style="background:#f9fafb; padding:20px; font-size:13px; color:#777;">
                  © 2026 Your Company. All rights reserved.
                </td>
              </tr>

            </table>

          </td>
        </tr>
      </table>

    </body>
    </html>
    `
      await sender.sendMail(
        {
          to: ExistingUser.Email,
          from: "cssflows@gmail.com",
          subject: "CODE TO CHANGE OTP",
          html: template,

        }
      )
        .then(() => console.log("User Email sent"))
        .catch((err) => console.log(err))


      // const data = await fetch("https://2factor.in/API/V1/1219c576-5337-11f1-9800-0200cd936042/SMS/+91" + phone + "/" + ExistingUser.OTP + "/" + "OTP_SENDER")
      // const response = await data.json()


      res.status(200).json(
        {
          "Email": ExistingUser.Email,
          "OTP": ExistingUser.OTP,
          // response
        }
      )



    }
    else {
      res.status(404).json("NO user found, Go to SignUp page")
    }

  } catch (error) {
    console.log(error)
  }
})

app.post("/reset_password", async (req, res) => {
  try {

    const UsersData = await fs.readFile("./database/users.json", "utf-8")
    const { mail, OTP, New_Password } = req.body

    if (!mail || !OTP || !New_Password) {
      res.json({ "message": "Give All Neccessary Details" })
      return
    }

    const userArr = JSON.parse(UsersData)
    const validUser = userArr.find(user => user.Email === mail && user.OTP == OTP)

    if (validUser) {
      validUser.Password = New_Password
      validUser.OTP = undefined
      const NewData = JSON.stringify(userArr, null, 2)
      await fs.writeFile("./database/users.json", NewData)
      res.status(200).json(validUser)

    }
    else {
      res.status(401).json({ "message": "Wrong data" })
    }



  } catch (error) {
    console.log(error)
  }
})

app.post("/addtask", async (req, res) => {
  try {
    const UsersData = await fs.readFile("./database/users.json", "utf-8");
    const UserArr = JSON.parse(UsersData);

    const { Email, Password, Task } = req.body;

    if (!Email || !Password || !Task) {
      return res.json("Give all required data")
    }

    const ExistingUser = UserArr.find(
      user => user.Email === Email && user.Password === Password
    );

    if (!ExistingUser) {
      return res.json("User not found");

    }

    const givenTask = Task.trim()

    if (givenTask == "") {
      return res.json("Enter Valid Task")
    }


    if (!ExistingUser.Tasks) {
      ExistingUser.Tasks = [];
    }

    const firstPart = givenTask.trim().substring(0, 3).toUpperCase();

    const secondPart = Math.floor(100 + Math.random() * 900);

    const id = firstPart + secondPart;

    const today = new Date();
    const AddDate = `${String(today.getDate()).padStart(2, "0")}/${String(today.getMonth() + 1).padStart(2, "0")}/${today.getFullYear()}`;

    const AddTime = today.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });
    ExistingUser.Tasks.unshift({ id: id, Task: givenTask, AddedDate: AddDate, AddedTime: AddTime });

    await fs.writeFile(
      "./database/users.json",
      JSON.stringify(UserArr, null, 2)
    );

    res.json({Message:"Task Added"});

  } catch (error) {
    console.log(error);
    res.json("Server Error");
  }
});

app.post("/removetask", async (req, res) => {
  try {
    const UsersData = await fs.readFile("./database/users.json", "utf-8");
    const UserArr = JSON.parse(UsersData);

    const { Email, Password, id } = req.body;
    if (!Email || !Password || !id) {
      return res.json("Give all required data")
    }

    const ExistingUser = UserArr.find(
      user => user.Email === Email && user.Password === Password
    );

    if (!ExistingUser) {
      return res.json("User not found");
    }

    const ExistingTask = ExistingUser.Tasks.find(task => task.id === id);

    if (!ExistingTask) {
      return res.json("No tasks found");
    }

    ExistingUser.Tasks = ExistingUser.Tasks.filter(task => task.id !== id);

    await fs.writeFile(
      "./database/users.json",
      JSON.stringify(UserArr, null, 2)
    );

    res.json("Task Removed");

  } catch (error) {
    console.log(error);
    res.json("Server Error");
  }
});


app.post("/alltasks", async (req, res) => {
  try {

    const UsersData = await fs.readFile("./database/users.json", "utf-8")
    const UserArr = JSON.parse(UsersData)
    const { Email, Password } = req.body

    if (!Email || !Password) {
      return res.json("Give all required data")
    }

    const ExistingUser = UserArr.find(u => u.Email === Email && u.Password === Password)

    if (!ExistingUser) {
      return res.status(404).json("User not found");
    }

    res.json({
      "No of Tasks": ExistingUser.Tasks ? ExistingUser.Tasks.length : 0,
      "TASKS": ExistingUser.Tasks || []
    })


  } catch (error) {
    console.log(error)
    res.json(error.message)
  }
})

app.listen(1111, () => {
  console.log("Server started on port http://localhost:1111")
})


// fetch("http://localhost:8080/addtask/new taskasd asdhashdjas dasd da")
// har task ka unique id hona chahiye