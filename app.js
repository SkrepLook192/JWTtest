let token = null;

document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;
    const messageEl = document.getElementById('registerMessage');
    
    const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const result = await response.json();

    if (response.ok) {
        messageEl.style.color = 'green';
        messageEl.textContent = result.message || 'Регистрация успешна!';
    } else {
        messageEl.style.color = 'red';
        messageEl.textContent = result.message || 'Ошибка регистрации';
    }
});

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const messageEl = document.getElementById('loginMessage');

    const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const result = await response.json();

    if (response.ok) {
        token = result.token;
        messageEl.style.color = 'green';
        messageEl.textContent = 'Вход выполнен успешно!';
    } else {
        messageEl.style.color = 'red';
        messageEl.textContent = result.message || 'Ошибка входа';
    }
});

document.getElementById('fetchProtectedData').addEventListener('click', async () => {
    const messageEl = document.getElementById('protectedData');

    if (!token) {
        messageEl.style.color = 'red';
        messageEl.textContent = 'Пожалуйста, войдите в систему';
        return;
    }

    const response = await fetch('http://localhost:3000/protected', {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    const result = await response.json();

    if (response.ok) {
        messageEl.style.color = 'green';
        messageEl.textContent = JSON.stringify(result);
    } else {
        messageEl.style.color = 'red';
        messageEl.textContent = 'Доступ запрещён';
    }
});
