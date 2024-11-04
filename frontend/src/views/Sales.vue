<template>
  <div class="page-container">
    <b-card class="sales-card">
      <template #header>
        <div class="d-flex justify-content-between align-items-center">
          <h2 class="h3 mb-0">Sales Spreadsheet</h2>
          <div class="d-flex align-items-center">
            <b-form-input
              v-model="searchTerm"
              placeholder="Search products or customers"
              class="mr-4"
              size="sm"
              style="width: 200px;"
            ></b-form-input>
            
            <b-button 
              variant="primary" 
              size="sm"
              @click="exportToCSV"
            >
              <font-awesome-icon icon="download" class="mr-2"/>
              Export CSV
            </b-button>
          </div>
        </div>
      </template>

      <b-table
        :items="filteredSales"
        :fields="fields"
        striped
        hover
        responsive
        sort-icon-left
        @sort-changed="handleSort"
      >
        <template #cell(unitPrice)="data">
          ${{ formatPrice(data.value) }}
        </template>
        <template #cell(totalSale)="data">
          ${{ formatPrice(data.value) }}
        </template>
      </b-table>
    </b-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Sales',
  data() {
    return {
      searchTerm: '',
      sortBy: null,
      sortDesc: false,
      fields: [
        { key: 'date', label: 'Date', sortable: true },
        { key: 'product', label: 'Product', sortable: true },
        { key: 'quantity', label: 'Quantity', sortable: true, class: 'text-right' },
        { key: 'unitPrice', label: 'Unit Price', sortable: true, class: 'text-right' },
        { key: 'totalSale', label: 'Total Sale', sortable: true, class: 'text-right' },
        { key: 'customer', label: 'Customer', sortable: true }
      ]
    }
  },
  computed: {
    ...mapState(['inventory']),
    sales() {
      // Generate sales data based on inventory
      return this.inventory.map(item => ({
        id: item.item_id,
        date: new Date().toISOString().split('T')[0],
        product: item.name,
        quantity: Math.floor(Math.random() * 100),
        unitPrice: item.price || 9.99,
        totalSale: (item.price || 9.99) * Math.floor(Math.random() * 100),
        customer: ['ABC Corp', 'XYZ Inc', '123 Industries', 'Best Buyers'][Math.floor(Math.random() * 4)]
      }))
    },
    filteredSales() {
      return this.sales.filter(sale => 
        sale.product.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        sale.customer.toLowerCase().includes(this.searchTerm.toLowerCase())
      )
    }
  },
  methods: {
    formatPrice(value) {
      return value.toFixed(2)
    },
    handleSort(ctx) {
      this.sortBy = ctx.sortBy
      this.sortDesc = ctx.sortDesc
    },
    exportToCSV() {
      // Prepare CSV data
      const headers = this.fields.map(field => field.label).join(',')
      const rows = this.filteredSales.map(sale => [
        sale.date,
        `"${sale.product}"`,
        sale.quantity,
        sale.unitPrice,
        sale.totalSale,
        `"${sale.customer}"`
      ].join(','))
      
      const csvContent = [headers, ...rows].join('\n')
      
      // Create and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      
      link.setAttribute('href', url)
      link.setAttribute('download', `sales_${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  },
  created() {
    if (!this.inventory.length) {
      this.$store.dispatch('fetchInventory')
    }
  }
}
</script>

<style scoped>
.sales-card {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.page-container {
  padding: 1.5rem;
}
</style> 