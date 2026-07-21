export function emailLayout(title: string, body: string) {
  return `
<!DOCTYPE html>
<html>

<head>

<meta charset="UTF-8"/>

<style>

body{
    margin:0;
    padding:40px;
    background:#f4f4f4;
    font-family:Arial,Helvetica,sans-serif;
}

.container{
    max-width:650px;
    margin:auto;
    background:white;
    border-radius:10px;
    padding:40px;
}

.logo{
    font-size:30px;
    font-weight:bold;
    color:#e67e22;
    margin-bottom:30px;
}

.footer{
    margin-top:40px;
    font-size:12px;
    color:#888;
}

.button{
    display:inline-block;
    background:#e67e22;
    color:white;
    text-decoration:none;
    padding:12px 24px;
    border-radius:6px;
}

</style>

</head>

<body>

<div class="container">

<div class="logo">

${process.env.APP_NAME}

</div>

<h2>${title}</h2>

${body}

<div class="footer">

This is an automated email from ${process.env.APP_NAME}. Please do not reply to this email.

</div>

</div>

</body>

</html>
`;
}