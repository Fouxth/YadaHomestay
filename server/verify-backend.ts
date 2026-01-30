
import { spawn } from 'child_process';
import http from 'http';

const SERVER_PORT = 3000;
const API_URL = `http://localhost:${SERVER_PORT}/api`;

function waitForServer(port: number, timeout = 20000): Promise<void> {
    return new Promise((resolve, reject) => {
        const start = Date.now();
        const interval = setInterval(() => {
            if (Date.now() - start > timeout) {
                clearInterval(interval);
                reject(new Error('Server timeout'));
            }
            const req = http.get(`http://localhost:${port}/health`, (res) => {
                if (res.statusCode === 200) {
                    clearInterval(interval);
                    resolve();
                }
            });
            req.on('error', () => { });
            req.end();
        }, 500);
    });
}

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function runTests() {
    console.log('Starting server...');
    const serverParams = ['src/index.ts'];
    // Use npx ts-node src/index.ts
    // On windows we need to be careful with spawn.
    const server = spawn('npx.cmd', ['ts-node', 'src/index.ts'], {
        cwd: process.cwd(),
        stdio: 'inherit',
        shell: true
    });

    try {
        await waitForServer(SERVER_PORT);
        console.log('Server is up!');

        // 1. Login
        console.log('Testing Login...');
        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'admin', password: '123456' })
        });

        if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.status}`);
        const loginData = await loginRes.json();
        const token = loginData.token;
        console.log('Login successful, token received.');

        const headers = { 'Authorization': `Bearer ${token}` };

        // 2. Test Customer
        console.log('Testing Customers...');
        const custRes = await fetch(`${API_URL}/customers`, { headers });
        if (!custRes.ok) throw new Error(`Customers failed: ${custRes.status}`);
        console.log(`Customers: ${(await custRes.json()).length} found.`);

        // 3. Test Cleaning
        console.log('Testing Cleaning...');
        const cleanRes = await fetch(`${API_URL}/cleaning`, { headers });
        if (!cleanRes.ok) throw new Error(`Cleaning failed: ${cleanRes.status}`);
        console.log(`Cleaning Tasks: ${(await cleanRes.json()).length} found.`);

        // 4. Test Maintenance
        console.log('Testing Maintenance...');
        const maintRes = await fetch(`${API_URL}/maintenance`, { headers });
        if (!maintRes.ok) throw new Error(`Maintenance failed: ${maintRes.status}`);
        console.log(`Maintenance Tasks: ${(await maintRes.json()).length} found.`);

        // 5. Test Inventory
        console.log('Testing Inventory...');
        const invRes = await fetch(`${API_URL}/inventory/movements`, { headers });
        if (!invRes.ok) throw new Error(`Inventory failed: ${invRes.status}`);
        console.log(`Stock Movements: ${(await invRes.json()).length} found.`);

        // 6. Test Finance
        console.log('Testing Finance...');
        const finRes = await fetch(`${API_URL}/finance/summary`, { headers });
        if (!finRes.ok) throw new Error(`Finance failed: ${finRes.status}`);
        console.log(`Finance Summary fetched.`);

        // 7. Test Settings
        console.log('Testing Settings...');
        const setRes = await fetch(`${API_URL}/settings`, { headers });
        if (!setRes.ok) throw new Error(`Settings failed: ${setRes.status}`);
        console.log(`Settings: ${(await setRes.json()).length} found.`);

        console.log('ALL TESTS PASSED!');

    } catch (e) {
        console.error('Test Failed:', e);
        process.exit(1);
    } finally {
        console.log('Stopping server...');
        server.kill();
        process.exit(0);
    }
}

runTests();
