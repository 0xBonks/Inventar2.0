<template>
  <div class="page-container">
    <b-card class="card">
      <template #header>
        <div class="d-flex justify-content-between align-items-center">
          <h2 class="card-title">Joba Inventory</h2>
          <div class="d-flex">
            <b-button 
              variant="outline-primary" 
              size="sm" 
              @click="exportToCSV"
              class="mr-4"
            >
              <font-awesome-icon icon="download" class="mr-2"/>
              Export CSV
            </b-button>
            <b-button 
              variant="primary" 
              size="sm" 
              @click="showAddModal = true"
            >
              <font-awesome-icon icon="plus" class="mr-2"/>
              Add Item
            </b-button>
          </div>
        </div>
      </template>

      <div class="card-body">
        <b-table
          :items="filteredInventory"
          :fields="fields"
          striped
          hover
          responsive
          selectable
          select-mode="multi"
          @row-selected="onRowSelected"
        >
          <!-- Name Column -->
          <template #cell(name)="data">
            <b-form-input
              v-if="editingId === data.item.item_id"
              v-model="editForm.name"
              size="sm"
            ></b-form-input>
            <span v-else>{{ data.value }}</span>
          </template>

          <!-- Quantity Column -->
          <template #cell(quantity)="data">
            <b-form-input
              v-if="editingId === data.item.item_id"
              v-model.number="editForm.quantity"
              type="number"
              size="sm"
            ></b-form-input>
            <span v-else>{{ data.value }}</span>
          </template>

          <!-- Location Column -->
          <template #cell(location)="data">
            <b-form-select
              v-if="editingId === data.item.item_id"
              v-model="editForm.location"
              :options="locationOptions.filter(loc => loc.value !== 'All')"
              size="sm"
            ></b-form-select>
            <span v-else>{{ data.value }}</span>
          </template>

          <!-- Status Column -->
          <template #cell(status)="data">
            <b-badge
              v-if="editingId === data.item.item_id"
              :variant="getStatusVariant(editForm.status)"
              class="status-badge"
            >
              <b-form-select
                v-model="editForm.status"
                :options="statusOptions"
                size="sm"
                class="status-select"
              ></b-form-select>
            </b-badge>
            <b-badge
              v-else
              :variant="getStatusVariant(data.value)"
              class="status-badge"
            >
              {{ data.value }}
            </b-badge>
          </template>

          <!-- Actions Column -->
          <template #cell(actions)="data">
            <div class="d-flex" v-if="editingId === data.item.item_id">
              <b-button
                variant="success"
                size="sm"
                class="mr-2"
                @click="saveEdit()"
              >
                <font-awesome-icon icon="save" />
              </b-button>
              <b-button
                variant="outline-secondary"
                size="sm"
                @click="cancelEdit()"
              >
                <font-awesome-icon icon="times" />
              </b-button>
            </div>
            <b-button
              v-else
              variant="light"
              size="sm"
              @click="startEdit(data.item)"
            >
              <font-awesome-icon icon="edit" />
            </b-button>
          </template>
        </b-table>
      </div>
    </b-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Inventory',
  data() {
    return {
      editingId: null,
      selectedRows: [],
      editForm: {
        name: '',
        quantity: 0,
        location: '',
        status: ''
      },
      fields: [
        { key: 'name', sortable: true },
        { key: 'quantity', sortable: true },
        { key: 'location', sortable: true },
        { key: 'status', sortable: true },
        { key: 'actions', label: '' }
      ],
      statusOptions: [
        { value: 'In Stock', text: 'In Stock' },
        { value: 'Low', text: 'Low Stock' },
        { value: 'Out', text: 'Out of Stock' }
      ]
    }
  },
  computed: {
    ...mapGetters(['filteredInventory'])
  },
  methods: {
    onRowSelected(rows) {
      this.selectedRows = rows
    },
    exportToCSV() {
      // Use selected rows if any, otherwise use all inventory
      const dataToExport = this.selectedRows.length > 0 ? this.selectedRows : this.filteredInventory

      // Prepare CSV data
      const headers = ['Name', 'Quantity', 'Location', 'Status'].join(',')
      const rows = dataToExport.map(item => [
        `"${item.name}"`,
        item.quantity,
        `"${item.location}"`,
        `"${item.status}"`
      ].join(','))
      
      const csvContent = [headers, ...rows].join('\n')
      
      // Create and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      
      link.setAttribute('href', url)
      link.setAttribute('download', `inventory_${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Show success message
      this.$bvToast.toast('Inventory exported successfully', {
        title: 'Success',
        variant: 'success',
        solid: true
      })
    },
    getStatusVariant(status) {
      const variants = {
        'In Stock': 'success',
        'Low': 'warning',
        'Out': 'danger'
      }
      return variants[status] || 'secondary'
    },
    startEdit(item) {
      this.editingId = item.item_id;
      this.editForm = {
        name: item.name,
        quantity: parseInt(item.quantity),
        location: item.location,
        status: item.status
      };
    },
    async saveEdit() {
      try {
        const updateData = {
          name: this.editForm.name,
          quantity: parseInt(this.editForm.quantity),
          location: this.editForm.location,
          status: this.editForm.status
        };

        await this.$store.dispatch('updateInventoryItem', {
          id: this.editingId,
          data: updateData
        });

        // Refresh inventory data
        await this.$store.dispatch('fetchInventory');
        
        this.editingId = null;
        this.$bvToast.toast('Item updated successfully', {
          title: 'Success',
          variant: 'success',
          solid: true
        });
      } catch (error) {
        console.error('Update error:', error);
        const errorMessage = error.response && error.response.data && error.response.data.error 
          ? error.response.data.error 
          : 'Unknown error';
        
        this.$bvToast.toast('Failed to update item: ' + errorMessage, {
          title: 'Error',
          variant: 'danger',
          solid: true
        });
      }
    },
    cancelEdit() {
      this.editingId = null
      this.editForm = {
        name: '',
        quantity: 0,
        location: '',
        status: ''
      }
    }
  },
  created() {
    this.$store.dispatch('fetchInventory')
  }
}
</script>

<style lang="scss">
// Component specific styles
.status-badge {
  font-weight: 500;
  text-shadow: none;
}

.status-select {
  background: transparent;
  border: none;
  color: inherit;
  width: auto;
  padding: 0;
}

// Override badge colors with simpler design
.badge-success {
  background-color: #22c55e !important;
  color: white !important;
}

.badge-warning {
  background-color: #eab308 !important;
  color: black !important;
}

.badge-danger {
  background-color: #ef4444 !important;
  color: white !important;
}

// Add styles for the export button
.btn-outline-primary {
  &:hover {
    .fa-download {
      transform: translateY(1px);
    }
  }
}

// Add styles for selected rows
table tbody tr.selected {
  background-color: rgba(0, 123, 255, 0.1) !important;
}

.btn-group .btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style> 