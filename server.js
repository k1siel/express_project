
//rzeczy które pozwalają robic rzeczy
const express = require("express");
const app = express();
var PORT = process.env.PORT || 3000;
var path = require("path")
var bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({ extended: true }));

var logged = false

//dostęp do katalogu static
app.use(express.static('static'))

//tabelka z danymi userow

var tab = [
    { id: 1, log: "AAA", pass: "PASS1", wiek: 15, uczen: "checked", plec: "m" },
    { id: 2, log: "bbb", pass: "PASS2", wiek: 12, uczen: "undefined", plec: "k" },
    { id: 3, log: "cccc", pass: "PASS3", wiek: 10, uczen: "checked", plec: "m" },
    { id: 4, log: "eeeee", pass: "PASS4", wiek: 19, uczen: "checked", plec: "k" },
]



//obsługa adresów stron podstawowych
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + "/static/index.html"))
})

app.get('/register', function (req, res) {
    res.sendFile(path.join(__dirname + "/static/register.html"))
})

app.get('/login', function (req, res) {
    res.sendFile(path.join(__dirname + "/static/login.html"))
})

app.get('/admin', function (req, res) {
    if (logged == true) {
        res.sendFile(path.join(__dirname + "/static/admin.html"))
    }
    else {
        res.sendFile(path.join(__dirname + "/static/noauth.html"))
    }
})

app.get('/logout', function (req, res) {
    logged = false
    res.redirect("/admin")
})

app.get('/show', function (req, res) {
    if (logged == true) {

        //wyswietlanie tabelki z danymi
        let show = "<body style='margin: 0px; padding: 0px;'><div style='width:100%; height:100%; background-color:#e6eff5;'>"
        show += "<div style='background-color:#1a3373 ; color:#e6eff5; padding: 10px;'><a href='/sort' style='color:#a0c4db'>sort</a> <a href='/gender' style='color:#a0c4db'>gender</a> <a href='/show' style='color:#a0c4db'>show</a></div> <div style='width: 100%;'><table>"
        for (let i = 0; i < tab.length; i++) {
            let entries = Object.entries(tab[i])
            show += "<tr>"
            for (let j = 0; j < entries.length; j++) {
                if (entries[j][0] == "log") {
                    show += "<td style='border: solid #031624 1px; color: #123752; width: 150px; height: 30px'> user: " + entries[j][1] + " - " + entries[j + 1][1] + "</td>"
                }
                if (entries[j][0] == "pass") {

                }
                if (entries[j][0] == "uczen") {
                    show += "<td style='border: solid #031624 1px; color: #123752; width: 150px; height: 30px'> uczeń: "
                    if (entries[j][1] == "checked") {
                        show += '<input type="checkbox" checked disabled></input>'
                    }
                    else {
                        show += '<input type="checkbox" disabled></input>'
                    }
                    show += "</td>"
                }
                if (entries[j][0] == "wiek" || entries[j][0] == "plec" || entries[j][0] == "id") {
                    show += "<td style='border: solid #031624 1px; color: #123752; width: 150px; height: 30px'>" + entries[j][0] + ":" + entries[j][1] + "</td>"
                }
            }
            show += "</tr>"
            console.log(entries)
        }
        show += "</table></div></div></body>"
        res.send(show)
    }
    else {

        res.sendFile(path.join(__dirname + "/static/noauth.html"))
    }
})

app.get('/gender', function (req, res) {
    if (logged == true) {

        //sortowanko po płci
        let show = "<body style='margin: 0px; padding: 0px;'><div style='width:100%; height:100%; background-color:#e6eff5;'>"
        show += "<div style='background-color:#1a3373 ; color:#e6eff5; padding: 10px;'><a href='/sort' style='color:#a0c4db'>sort</a> <a href='/gender' style='color:#a0c4db'>gender</a> <a href='/show' style='color:#a0c4db'>show</a></div> <div style='width: 100%;'><table>"
        let girls = []
        let boys = []
        let temp = {
        }
        for (let i = 0; i < tab.length; i++) {
            temp = {
                id: tab[i].id,
                plec: tab[i].plec,
            }

            if (tab[i].plec == "k") {
                girls.push(temp)
            }
            else {
                boys.push(temp)
            }
        }
        console.log(boys, girls)

        for (let i = 0; i < girls.length; i++) {
            let entries = Object.entries(girls[i])
            show += "<tr>"
            for (let j = 0; j < entries.length; j++) {
                show += "<td style='border: solid #031624 1px; color: #123752; width: 150px; height: 30px'>" + entries[j][0] + ":" + entries[j][1] + "</td>"
            }
            show += "</tr>"
        }

        show += "</table></div><div><table>"
        for (let i = 0; i < boys.length; i++) {
            let entries = Object.entries(boys[i])
            show += "<tr style='border: solid black 1px'>"
            for (let j = 0; j < entries.length; j++) {
                show += "<td style='border: solid #031624 1px; color: #123752; width: 150px; height: 30px'>" + entries[j][0] + ":" + entries[j][1] + "</td>"
            }
            show += "</tr>"
        }
        show += "</table></div></div></body>"

        res.send(show)
    }
    else {
        res.sendFile(path.join(__dirname + "/static/noauth.html"))
    }
})



app.get('/sort', function (req, res) {
    if (logged == true) {

        // wyswietlanie tabelki do sortowania
        let show = "<body style='margin: 0px; padding: 0px;'><div style='width:100%; height:100%; background-color:#e6eff5;'>"
        show += "<div style='background-color:#1a3373 ; color:#e6eff5; padding: 10px;'><a href='/sort' style='color:#a0c4db'>sort</a> <a href='/gender' style='color:#a0c4db'>gender</a> <a href='/show' style='color:#a0c4db'>show</a></div> <form action='/sort' method ='POST' onchange='this.submit()'><label>rosnąco</label><input type='radio' id='rosnaco' name='sort' value='rosnaco'><label>malejaco</label><input type='radio' id='malejaco' name='sort' value='malejaco'><form>"

        show += "<div style='width: 100%;'><table>"
        for (let i = 0; i < tab.length; i++) {
            let entries = Object.entries(tab[i])
            show += "<tr style='border: solid black 1px'>"
            for (let j = 0; j < entries.length; j++) {
                if (entries[j][0] == "id" || entries[j][0] == "wiek") {
                    show += "<td style='border: solid #031624 1px; color: #123752; width: 150px; height: 30px'>" + entries[j][0] + " : " + entries[j][1] + "</td>"
                }
                else if (entries[j][0] == "log") {
                    show += "<td style='border: solid #031624 1px; color: #123752; width: 150px; height: 30px'> user : " + entries[j][1] + " - " + entries[j + 1][1] + "</td>"
                }

            }
            show += "</tr>"
            console.log(entries)
        }
        show += "</table></div></div></body>"

        res.send(show)
        console.log(req.body)

    }
    else {
        res.sendFile(path.join(__dirname + "/static/noauth.html"))
    }
})

//odczytanie formularzy
app.post("/register", function (req, res) {

    //sprawdzenie czy login jest unikalny
    let checker = 0
    for (let i = 0; i < tab.length; i++) {
        if (tab[i].log == req.body.login) {
            checker++
        }
    }

    if (checker == 0) {
        res.send("witaj " + req.body.login + " zostałeś zarejestrowany")

        //dodanie usera do bazy
        let userData = {

            id: tab[tab.length - 1].id + 1,
            log: req.body.login,
            pass: req.body.password,
            wiek: parseInt(req.body.wiek),
            uczen: req.body.uczen,
            plec: req.body.gender
        }
        tab.push(userData)
        console.log(tab)
    }
    else {
        //wywalenie błędu jak jest zajęty login
        res.send(req.body.login + " - ten login jest zajęty")
    }
})

app.post("/login", function (req, res) {
    // sprawdzenie prawidłowości danych
    for (let i = 0; i < tab.length; i++) {
        if (tab[i].log == req.body.login && tab[i].pass == req.body.password) {
            logged = true
        }

    }
    //przekierowanie po zalogowaniu
    if (logged == true) {
        res.redirect("/admin")
    }

    //błąd po niezalogowaniu
    else {
        res.send("błędny login lub hasło")
    }
})

app.post("/sort", function (req, res) {
    console.log(req.body)
    let show = "<body style='margin: 0px; padding: 0px;'><div style='width:100%; height:100%; background-color:#e6eff5;'>"
    show += "<div style='background-color:#1a3373 ; color:#e6eff5; padding: 10px;'><a href='/sort' style='color:#a0c4db'>sort</a> <a href='/gender' style='color:#a0c4db'>gender</a> <a href='/show' style='color:#a0c4db'>show</a></div>"
    if (req.body.sort == 'rosnaco') {

        tab.sort(function (a, b) {
            return parseFloat(a.wiek) - parseFloat(b.wiek);
        });
        tab = tab.sort()

        show += "<form action='/sort' method ='POST' onchange='this.submit()'><label>rosnąco</label><input type='radio' id='rosnaco' name='sort' value='rosnaco' checked='checked'><label>malejaco</label><input type='radio' id='malejaco' name='sort' value='malejaco'><form>"
    }
    else if (req.body.sort == 'malejaco') {

        tab.sort(function (a, b) {
            return parseFloat(b.wiek) - parseFloat(a.wiek);
        });
        tab = tab.sort()

        console.log(tab)
        show += "<form action='/sort' method ='POST' onchange='this.submit()'><label>rosnąco</label><input type='radio' id='rosnaco' name='sort' value='rosnaco' ><label>malejaco</label><input type='radio' id='malejaco' name='sort' value='malejaco' checked='checked'><form>"
    }


    show += "<div style='width: 100%;'><table>"
    for (let i = 0; i < tab.length; i++) {
        let entries = Object.entries(tab[i])
        show += "<tr style='border: solid black 1px'>"
        for (let j = 0; j < entries.length; j++) {
            if (entries[j][0] == "id" || entries[j][0] == "wiek") {
                show += "<td style='border: solid #031624 1px; color: #123752; width: 150px; height: 30px'>" + entries[j][0] + " : " + entries[j][1] + "</td>"
            }
            else if (entries[j][0] == "log") {
                show += "<td style='border: solid #031624 1px; color: #123752; width: 150px; height: 30px'> user :" + entries[j][1] + " - " + entries[j + 1][1] + "</td>"
            }

        }
        show += "</tr>"

    }
    show += "</table></div></div></body>"

    res.send(show)


})

//nasłuchwianie na serwerze
app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)

})