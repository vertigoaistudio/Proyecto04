/**
 * Zen Luxury CRM - Business Logic
 */

class CRMApp {
    constructor() {
        this.clients = JSON.parse(localStorage.getItem('zen_crm_clients')) || [];
        this.currentClientId = null;
        
        // DOM Elements
        this.addBtn = document.getElementById('addClientBtn');
        this.modal = document.getElementById('clientModal');
        this.modalTitle = document.getElementById('modalTitle');
        this.clientForm = document.getElementById('clientForm');
        this.clientGrid = document.getElementById('clientGrid');
        this.searchInput = document.getElementById('searchInput');
        this.totalCount = document.getElementById('totalCount');
        this.pendingCount = document.getElementById('pendingCount');
        this.convertedCount = document.getElementById('convertedCount');
        
        this.init();
    }

    init() {
        // Event Listeners
        this.addBtn.addEventListener('click', () => this.openModal());
        this.clientForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        this.searchInput.addEventListener('input', () => this.renderClients());
        
        document.querySelectorAll('.close-btn, .close-modal').forEach(btn => {
            btn.addEventListener('click', () => this.closeModal());
        });

        // Initial Render
        this.renderClients();
    }

    openModal(client = null) {
        if (client) {
            this.modalTitle.innerText = "Editar Cliente";
            this.currentClientId = client.id;
            document.getElementById('clientName').value = client.name;
            document.getElementById('clientEmail').value = client.email;
            document.getElementById('clientCompany').value = client.company;
            document.getElementById('clientStatus').value = client.status;
        } else {
            this.modalTitle.innerText = "Añadir Cliente";
            this.currentClientId = null;
            this.clientForm.reset();
        }
        this.modal.classList.add('active');
    }

    closeModal() {
        this.modal.classList.remove('active');
        this.clientForm.reset();
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        const clientData = {
            id: this.currentClientId || Date.now(),
            name: document.getElementById('clientName').value,
            email: document.getElementById('clientEmail').value,
            company: document.getElementById('clientCompany').value,
            status: document.getElementById('clientStatus').value,
            createdAt: new Date().toISOString()
        };

        if (this.currentClientId) {
            // Update
            const index = this.clients.findIndex(c => c.id === this.currentClientId);
            this.clients[index] = clientData;
        } else {
            // Create
            this.clients.push(clientData);
        }

        this.saveAndRender();
        this.closeModal();
    }

    deleteClient(id) {
        if (confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
            this.clients = this.clients.filter(c => c.id !== id);
            this.saveAndRender();
        }
    }

    changeStatus(id) {
        const statuses = ['nuevo', 'seguimiento', 'convertido', 'inactivo'];
        const client = this.clients.find(c => c.id === id);
        const currentIndex = statuses.indexOf(client.status);
        const nextIndex = (currentIndex + 1) % statuses.length;
        
        client.status = statuses[nextIndex];
        this.saveAndRender();
    }

    saveAndRender() {
        localStorage.setItem('zen_crm_clients', JSON.stringify(this.clients));
        this.renderClients();
    }

    updateStats() {
        this.totalCount.innerText = this.clients.length;
        this.pendingCount.innerText = this.clients.filter(c => c.status === 'seguimiento').length;
        this.convertedCount.innerText = this.clients.filter(c => c.status === 'convertido').length;
    }

    renderClients() {
        const searchTerm = this.searchInput.value.toLowerCase();
        const filteredClients = this.clients.filter(c => 
            c.name.toLowerCase().includes(searchTerm) || 
            c.email.toLowerCase().includes(searchTerm) ||
            c.company.toLowerCase().includes(searchTerm)
        );

        this.updateStats();

        if (filteredClients.length === 0) {
            this.clientGrid.innerHTML = `
                <div class="empty-state">
                    <i data-lucide="users"></i>
                    <p>${this.clients.length === 0 ? 'No hay clientes registrados aún.' : 'No se encontraron resultados.'}</p>
                </div>
            `;
            lucide.createIcons();
            return;
        }

        this.clientGrid.innerHTML = filteredClients.map(client => `
            <div class="client-card" data-id="${client.id}">
                <div class="client-info">
                    <h3>${client.name}</h3>
                    <span class="company">${client.company || 'Sin Empresa'}</span>
                </div>
                <div class="client-contact">
                    <div><i data-lucide="mail"></i> ${client.email}</div>
                    <div><i data-lucide="calendar"></i> ${new Date(client.createdAt).toLocaleDateString()}</div>
                </div>
                <div class="client-footer">
                    <span class="status status-${client.status}" onclick="app.changeStatus(${client.id})">
                        ${this.getStatusLabel(client.status)}
                    </span>
                    <div class="card-actions">
                        <button class="action-btn" onclick="app.openModal(app.clients.find(c => c.id === ${client.id}))">
                            <i data-lucide="edit-2"></i>
                        </button>
                        <button class="action-btn delete" onclick="app.deleteClient(${client.id})">
                            <i data-lucide="trash-2"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
        
        lucide.createIcons();
    }

    getStatusLabel(status) {
        const labels = {
            'nuevo': 'Nuevo',
            'seguimiento': 'Seguimiento',
            'convertido': 'Convertido',
            'inactivo': 'Inactivo'
        };
        return labels[status] || status;
    }
}

// Global instance for inline onclick handlers
const app = new CRMApp();
