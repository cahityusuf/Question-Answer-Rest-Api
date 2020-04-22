const express = require("express");
const dotenv = require("dotenv");
const routers = require("./routers");
const customErrorHandler = require("./middlewares/errors/customErrorHandler")
const connectDatabase = require("./helpers/database/connectDatabase")
const path = require("path");


dotenv.config({                     //dotenv paketini yükledikten sonra config/env/config.env dosyası oluşturulur.
    path: "./config/env/config.env" //daha sonra uygulamnın her yerinde kullanacağımız değişkenler burada tanımlanır.
                                    // tanımlaığımız dosyanı sol taraftaki gibi import ederiz. process.env.PORT şeklinde çağırırız.
})


connectDatabase();

const app = express();

app.use(express.json());//Express Middleware

const PORT = process.env.PORT; //localhost ta 3000 portunu belirledik faakat uygulamayı yayımlama aşamasında
                                       // bize başka bir port numarası tahsis edebilirler bunun için
                                       // process.env.PORT komutu kullandık.

// Routers Middleware
app.use("/api",routers);

app.get("/",(req,res)=>{ //tarayıcıdan http://localhost:3000 çağırgığımızda bir get isteği yolladığımızdan bir mesaj yayımlayalım.
    res.send("Hello Question Api");
})
//Erroro Handler

app.use(customErrorHandler);

app.use(express.static(path.join(__dirname, "public"))); //__dirname proje dosyasının bilgisayarda bulunan dizinini verir.
                                                        //express middleware statik dosyaların nerede olduğu bilgisi verilir
app.listen(PORT,()=>{ //belirlediğimiz port numarası ile server ayağa kalktığı zaman console içi,ndeki mesaj yayımlanır.
    console.log(`App Started on ${PORT} : ${process.env.NODE_ENV}`);
}); 
