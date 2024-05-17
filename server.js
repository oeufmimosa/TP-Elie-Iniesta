const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const dayjs = require('dayjs');
const localizedFormat = require('dayjs/plugin/localizedFormat');
const dotenv = require('dotenv');
const { formatBirthDate } = require('./utils/utils');

dotenv.config();
dayjs.extend(localizedFormat);
dayjs.locale('fr');

const app = express();
const PORT = process.env.APP_PORT || 3000;
const HOST = process.env.APP_LOCALHOST || 'localhost';

let students = [
    { name: "Sonia", birth: "2019-05-14" },
    { name: "Antoine", birth: "2000-12-05" },
    { name: "Alice", birth: "1990-09-14" },
    { name: "Sophie", birth: "2001-10-02" },
    { name: "Bernard", birth: "1980-08-21" }
];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'assets')));

app.set('views', path.join(__dirname, 'view'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('home', { students: students.map(student => ({ ...student, birth: formatBirthDate(student.birth) })) });
});

app.post('/add-student', (req, res) => {
    const { name, birth } = req.body;
    if (name && birth) {
        students.push({ name, birth });
    }
    res.redirect('/');
});

app.post('/delete-student', (req, res) => {
    const { name } = req.body;
    students = students.filter(student => student.name !== name);
    res.redirect('/');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
});
