 const API_URL = 'https://685177248612b47a2c0a3345.mockapi.io/contact';
    async function getContacts() {
      try {
        const res = await fetch(API_URL);
        const contacts = await res.json();
        const list = document.getElementById('contactList');
        list.innerHTML = '';
        contacts.forEach(contact => {
          const li = document.createElement('li');
          li.innerHTML = `
            <span>${contact.name} — ${contact.phone}</span>
            <div class="actions">
              <button onclick="editContact('${contact.id}', '${contact.name}', '${contact.phone}')">✏️ Редактировать</button>
              <button class="delete" onclick="deleteContact('${contact.id}')">🗑 Удалить</button>
            </div>
          `;
          list.appendChild(li);
        });
      } catch (error) {
        console.error('Ошибка при получении контактов:', error);
      }
    }
    async function addContact() {
      const nameInput = document.getElementById('name');
      const phoneInput = document.getElementById('phone');
      const name = nameInput.value.trim();
      const phone = phoneInput.value.trim();
      if (!name || !phone) {
        alert('Пожалуйста, заполните все поля.');
        return;
      }
      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, phone })
        });
        if (!response.ok) throw new Error('Ошибка при отправке данных');
        document.getElementById('successMessage').textContent = 'Контакт успешно добавлен!';
        const msg = document.getElementById('successMessage');
        msg.classList.add('active');
        
        setTimeout(() => {
          msg.classList.remove('active');
          msg.textContent = '';
        }, 1500);
        nameInput.value = '';
        phoneInput.value = '';
        getContacts();
      } catch (error) {
        console.error('Ошибка:', error);
        alert('Произошла ошибка при добавлении контакта.');
      }
    }
    async function deleteContact(id) {
      if (!confirm('Вы уверены, что хотите удалить контакт?')) return;
      try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        getContacts();
      } catch (error) {
        console.error('Ошибка при удалении контакта:', error);
      }
    }
    async function editContact(id, oldName, oldPhone) {
      const name = prompt('Новое имя:', oldName);
      const phone = prompt('Новый телефон:', oldPhone);
      if (!name || !phone) {
        alert('Имя и телефон не могут быть пустыми.');
        return;
      }
      try {
        await fetch(`${API_URL}/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, phone })
        });
        getContacts();
      } catch (error) {
        console.error('Ошибка при редактировании контакта:', error);
      }
    }

    window.onload = getContacts;
