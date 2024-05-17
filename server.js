const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const dayjs = require('dayjs');
const localizedFormat = require('dayjs/plugin/localizedFormat');
const dotenv = require('dotenv');
const fs = require('fs');
const { formatBirthDate } = require('./utils/utils');

dotenv.config();
dayjs.extend(localizedFormat);
dayjs.locale('fr');

const app = express();
const PORT = process.env.APP_PORT || 3000;
const HOST = process.env.APP_LOCALHOST || 'localhost';

const studentsFilePath = path.join(__dirname, 'Data', 'students.json');

const readStudentsFile = () => {
    const data = fs.readFileSync(studentsFilePath, 'utf-8');
    return JSON.parse(data);
};

const writeStudentsFile = (students) => {
    fs.writeFileSync(studentsFilePath, JSON.stringify(students, null, 2), 'utf-8');
};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'assets')));

app.set('views', path.join(__dirname, 'view'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    const students = readStudentsFile();
    res.render('home', { students: students.map(student => ({ ...student, birth: formatBirthDate(student.birth) })) });
});

app.post('/add-student', (req, res) => {
    const { name, birth } = req.body;
    if (name && birth) {
        const students = readStudentsFile();
        students.push({ name, birth });
        writeStudentsFile(students);
    }
    res.redirect('/');
});

app.post('/delete-student', (req, res) => {
    const { name } = req.body;
    let students = readStudentsFile();
    students = students.filter(student => student.name !== name);
    writeStudentsFile(students);
    res.redirect('/');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
});
