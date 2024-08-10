const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
const port = 3000;

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
}));

// File paths
const loginFilePath = path.join(__dirname, 'data', 'login.txt');
const petsFilePath = path.join(__dirname, 'data', 'pets.txt');

// Ensure files exist
if (!fs.existsSync(loginFilePath)) {
    fs.writeFileSync(loginFilePath, '', 'utf8');
}

if (!fs.existsSync(petsFilePath)) {
    fs.writeFileSync(petsFilePath, '', 'utf8');
}

// Middleware to make the user available in all templates
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// Root route
app.get('/', (req, res) => {
    res.redirect('/home');  // Redirect to /home when accessing the root
});

// Routes
app.get('/home', (req, res) => {
    res.render('home');
});

// Combine Find a cat/dog and Browse Available Pets
app.get('/find', (req, res) => {
    res.render('find', { pets: [] });
});
app.post('/find', (req, res) => {
    const { petType, breed, age, gender } = req.body;

    // Read the pets.txt file
    const petData = fs.readFileSync(petsFilePath, 'utf-8').trim();
    const pets = petData.split('\n').map(line => {
        const [id, username, type, petBreed, petAge, petGender, comments, petName] = line.split(':');
        return {
            id,
            username,
            type,
            breed: petBreed,
            age: petAge,
            gender: petGender,
            comments: comments,
            image: `${petName}.jpg` // Use the pet name to determine the image filename
        };
    });

    // Filter pets based on search criteria
    const filteredPets = pets.filter(pet => {
        return (petType ? pet.type === petType : true) &&
               (breed ? pet.breed.toLowerCase().includes(breed.toLowerCase()) : true) &&
               (age ? pet.age === age : true) &&
               (gender && gender !== 'any' ? pet.gender === gender : true);
    });

    // Render the find page with the filtered pets
    res.render('find', { pets: filteredPets });
});



// Create Account Route
app.get('/createaccount', (req, res) => {
    res.render('createaccount', { message: '' });
});

app.post('/createaccount', (req, res) => {
    const { username, password } = req.body;

    // Validate username and password
    const usernamePattern = /^[a-zA-Z0-9]+$/;
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,}$/;

    if (!usernamePattern.test(username)) {
        return res.render('createaccount', { message: 'Invalid username format.' });
    }

    if (!passwordPattern.test(password)) {
        return res.render('createaccount', { message: 'Invalid password format.' });
    }

    // Check if username already exists
    const loginData = fs.readFileSync(loginFilePath, 'utf-8');
    const users = loginData.split('\n').map(line => line.split(':')[0]);

    if (users.includes(username)) {
        return res.render('createaccount', { message: 'Username already exists.' });
    }

    // Save new user
    fs.appendFileSync(loginFilePath, `${username}:${password}\n`);
    res.render('createaccount', { message: 'Account created successfully!' });
});

// Render Login Page
app.get('/login', (req, res) => {
    res.render('login', { message: '' });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const users = fs.readFileSync(loginFilePath, 'utf-8').split('\n');

    const userExists = users.find(user => {
        const [storedUsername, storedPassword] = user.split(':');
        return storedUsername === username && storedPassword === password;
    });

    if (userExists) {
        req.session.user = username;
        res.redirect('/home');
    } else {
        res.render('login', { message: 'Invalid username or password' });
    }
});

// Handle Logout
app.get('/logout', (req, res) => {
    if (req.session.user) {
        req.session.destroy(err => {
            if (err) {
                return res.redirect('/home');
            }
            res.render('login', { message: 'You have been logged out successfully.' });
        });
    } else {
        res.render('login', { message: 'You are not logged in.' });
    }
});

// Dog Care Route
app.get('/dog', (req, res) => {
    res.render('dog');
});

// Cat Care Route
app.get('/cat', (req, res) => {
    res.render('cat');
});

// Contact Us Route
app.get('/contactus', (req, res) => {
    res.render('contactus');
});


// Pet Registration Route
app.post('/register-pet', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    const { petType, breed, age, gender, comments } = req.body;

    // Randomly select a pet name based on pet type
    const catNames = ['cat', 'luna', 'max', 'mittens', 'whiskers'];
    const dogNames = ['buddy', 'dog', 'max', 'rocky'];
    const petName = petType === 'cat' ? catNames[Math.floor(Math.random() * catNames.length)] : dogNames[Math.floor(Math.random() * dogNames.length)];

    // Read existing pet data
    const petData = fs.readFileSync(petsFilePath, 'utf-8');
    const petCount = petData.split('\n').filter(line => line.trim() !== '').length;

    // Save the new pet record with the randomly assigned pet name
    const newPetRecord = `${petCount + 1}:${req.session.user}:${petType}:${breed}:${age}:${gender}:${comments}:${petName}\n`;
    fs.appendFileSync(petsFilePath, newPetRecord);

    res.render('giveaway', { message: 'Pet registered successfully!', currentPage: 'giveaway' });
});



// Giveaway Route
app.get('/giveaway', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    res.render('giveaway', { message: '' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
