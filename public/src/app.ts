const API_URL = 'http://localhost:3000/api';


const loginForm = document.getElementById('loginForm') as HTMLFormElement;
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = (document.getElementById('email') as HTMLInputElement).value;
        const password = (document.getElementById('password') as HTMLInputElement).value;
        const errorDiv = document.getElementById('loginError') as HTMLDivElement;

        try {
            const res = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('token', data.token);
                window.location.href = '/crud.html';
            } else {
                errorDiv.innerText = data.error;
            }
        } catch (error) {
            errorDiv.innerText = 'Erro ao conectar com o servidor.';
        }
    });
}


const getToken = () => localStorage.getItem('token') || '';

async function loadUsers() {
    const res = await fetch(`${API_URL}/users`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    
    if (res.status === 401 || res.status === 403) {
        window.location.href = '/index.html';
        return;
    }

    const users = await res.json();
    const tbody = document.getElementById('userTableBody');
    if (tbody) {
        tbody.innerHTML = '';
        users.forEach((u: any) => {
            tbody.innerHTML += `
                <tr>
                    <td><img src="/uploads/${u.photo}" width="50" height="50" class="rounded-circle" style="object-fit: cover;"></td>
                    <td>${u.name}</td>
                    <td>${u.email}</td>
                    <td>${new Date(u.dob).toLocaleDateString('pt-BR')}</td>
                    <td>${u.address}</td>
                    <td>${u.gender}</td>
                    <td>
                        <button class="btn btn-danger btn-sm" onclick="deleteUser(${u.id})">Deletar</button>
                    </td>
                </tr>
            `;
        });
    }
}

const userForm = document.getElementById('userForm') as HTMLFormElement;
if (userForm) {
    userForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('name', (document.getElementById('u-name') as HTMLInputElement).value);
        formData.append('email', (document.getElementById('u-email') as HTMLInputElement).value);
        formData.append('dob', (document.getElementById('u-dob') as HTMLInputElement).value);
        formData.append('address', (document.getElementById('u-address') as HTMLInputElement).value);
        formData.append('gender', (document.getElementById('u-gender') as HTMLSelectElement).value);
        formData.append('password', (document.getElementById('u-password') as HTMLInputElement).value);
        
        const fileInput = document.getElementById('u-photo') as HTMLInputElement;
        if (fileInput.files && fileInput.files[0]) {
            formData.append('photo', fileInput.files[0]);
        }

        const res = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${getToken()}` },
            body: formData 
        });

        if (res.ok) {
            alert('Usuário cadastrado com sucesso!');
            userForm.reset();
            

            const modalElement = document.getElementById('userModal');
            if (modalElement) {
                const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
                modal.hide();
            }
            loadUsers();
        } else {
            const err = await res.json();
            alert('Erro: ' + err.error);
        }
    });
}

async function deleteUser(id: number) {
    if (confirm('Tem certeza que deseja deletar?')) {
        await fetch(`${API_URL}/users/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        loadUsers();
    }
}


(window as any).loadUsers = loadUsers;
(window as any).deleteUser = deleteUser;