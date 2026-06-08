const mysql = require('mysql2/promise');

const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emma', 'Robert', 'Olivia', 'William', 'Sophia'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
const clubs = ['Lakers', 'Bulls', 'Warriors', 'Celtics', 'Heat', 'Spurs', 'Knicks', 'Raptors', 'Mavericks', 'Bucks'];
const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'];
const plans = ['Basic Plan', 'Pro Plan', 'Premium Plan', 'Elite Plan'];
const paymentMethods = ['Credit Card', 'Bank Transfer', 'PayPal', 'Crypto'];
const statuses = ['Pending', 'Confirmed', 'Rejected'];

function randomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function formatDate(date) {
    return date.toISOString().slice(0, 19).replace('T', ' ');
}

async function seedData() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'coachhelper'
        });

        console.log('Connected to database. Seeding started...');

        // Fetch existing offers to get accurate plans and prices if any
        const [offers] = await connection.execute('SELECT * FROM offers');
        let availablePlans = plans;
        let planPrices = { 'Basic Plan': 29.99, 'Pro Plan': 49.99, 'Premium Plan': 99.99, 'Elite Plan': 149.99 };
        
        if (offers.length > 0) {
            availablePlans = offers.map(o => o.name);
            planPrices = {};
            offers.forEach(o => { planPrices[o.name] = o.price; });
        }

        const numUsers = 15;
        const insertedUsers = [];

        // Seed Users
        for (let i = 0; i < numUsers; i++) {
            const fname = randomItem(firstNames);
            const lname = randomItem(lastNames);
            const name = `${fname} ${lname}`;
            const email = `${fname.toLowerCase()}.${lname.toLowerCase()}${randomNumber(1, 999)}@example.com`;
            const phone = `+1${randomNumber(1000000000, 9999999999)}`;
            const club = `${randomItem(clubs)} Club`;
            const city = randomItem(cities);
            const plan = randomItem(availablePlans);
            const paymentMethod = randomItem(paymentMethods);
            const isVerified = Math.random() > 0.2 ? 1 : 0; // 80% chance verified
            
            let planStart = null;
            let planEnd = null;
            
            // Randomly assign active plans to some verified users
            if (isVerified && Math.random() > 0.3) {
                const start = randomDate(new Date(2026, 0, 1), new Date());
                const end = new Date(start);
                end.setDate(end.getDate() + 30); // Assuming monthly
                planStart = formatDate(start);
                planEnd = formatDate(end);
            }

            const [result] = await connection.execute(
                `INSERT INTO users (name, email, password, phone, club_name, city, plan, payment_method, role, is_email_verified, plan_start_date, plan_end_date) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'user', ?, ?, ?)`,
                [name, email, 'password123', phone, club, city, plan, paymentMethod, isVerified, planStart, planEnd]
            );
            insertedUsers.push({ id: result.insertId, email: email });
        }
        console.log(`Seeded ${numUsers} users.`);

        // Seed Orders
        const numOrders = 25;
        for (let i = 0; i < numOrders; i++) {
            const user = randomItem(insertedUsers);
            const plan = randomItem(availablePlans);
            const amount = planPrices[plan] || 29.99;
            const status = randomItem(statuses);
            const paymentMethod = randomItem(paymentMethods);
            const createdAt = formatDate(randomDate(new Date(2026, 4, 1), new Date())); // Last few months

            await connection.execute(
                `INSERT INTO orders (user_id, customer_email, plan, payment_method, amount, status, created_at) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [user.id, user.email, plan, paymentMethod, amount, status, createdAt]
            );
        }
        console.log(`Seeded ${numOrders} orders.`);

        // Seed Messages
        const numMessages = 10;
        const subjects = ['Need help with billing', 'Question about Elite Plan', 'Bug report', 'Feature request', 'Login issue'];
        const messageBodies = [
            'Hello, I am having trouble updating my payment method.',
            'Can you tell me more about the features in the new plan?',
            'The dashboard is not loading properly on my phone.',
            'It would be great if you could add a calendar integration.',
            'I cannot log in to my account since yesterday.'
        ];

        for (let i = 0; i < numMessages; i++) {
            const fname = randomItem(firstNames);
            const lname = randomItem(lastNames);
            const name = `${fname} ${lname}`;
            const email = `${fname.toLowerCase()}.${lname.toLowerCase()}@test.com`;
            const subject = randomItem(subjects);
            const message = randomItem(messageBodies);
            const createdAt = formatDate(randomDate(new Date(2026, 5, 1), new Date()));

            await connection.execute(
                `INSERT INTO messages (name, email, subject, message, created_at) VALUES (?, ?, ?, ?, ?)`,
                [name, email, subject, message, createdAt]
            );
        }
        console.log(`Seeded ${numMessages} messages.`);

        await connection.end();
        console.log('Seeding complete!');
    } catch (err) {
        console.error('Error seeding data:', err);
    }
}

seedData();
