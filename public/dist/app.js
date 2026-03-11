"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const API_URL = 'http://localhost:3000/api';
// --- LÓGICA DE LOGIN ---
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('loginError');
        try {
            const res = yield fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = yield res.json();
            if (res.ok) {
                localStorage.setItem('token', data.token);
                window.location.href = '/crud.html';
            }
            else {
                errorDiv.innerText = data.error;
            }
        }
        catch (error) {
            errorDiv.innerText = 'Erro ao conectar com o servidor.';
        }
    }));
}
// --- LÓGICA DO CRUD ---
const getToken = () => localStorage.getItem('token') || '';
function loadUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch(`${API_URL}/users`, {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        if (res.status === 401 || res.status === 403) {
            window.location.href = '/index.html';
            return;
        }
        const users = yield res.json();
        const tbody = document.getElementById('userTableBody');
        if (tbody) {
            tbody.innerHTML = '';
            users.forEach((u) => {
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
    });
}
const userForm = document.getElementById('userForm');
if (userForm) {
    userForm.addEventListener('submit', (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', document.getElementById('u-name').value);
        formData.append('email', document.getElementById('u-email').value);
        formData.append('dob', document.getElementById('u-dob').value);
        formData.append('address', document.getElementById('u-address').value);
        formData.append('gender', document.getElementById('u-gender').value);
        formData.append('password', document.getElementById('u-password').value);
        const fileInput = document.getElementById('u-photo');
        if (fileInput.files && fileInput.files[0]) {
            formData.append('photo', fileInput.files[0]);
        }
        const res = yield fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${getToken()}` },
            body: formData // AJAX usando FormData para suportar arquivo
        });
        if (res.ok) {
            alert('Usuário cadastrado com sucesso!');
            userForm.reset();
            // Fecha o modal via Bootstrap local
            const modalElement = document.getElementById('userModal');
            if (modalElement) {
                const modal = window.bootstrap.Modal.getInstance(modalElement);
                modal.hide();
            }
            loadUsers();
        }
        else {
            const err = yield res.json();
            alert('Erro: ' + err.error);
        }
    }));
}
function deleteUser(id) {
    return __awaiter(this, void 0, void 0, function* () {
        if (confirm('Tem certeza que deseja deletar?')) {
            yield fetch(`${API_URL}/users/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${getToken()}` }
            });
            loadUsers();
        }
    });
}
// Expõe as funções para o escopo global para serem chamadas pelo onclick no HTML
window.loadUsers = loadUsers;
window.deleteUser = deleteUser;
