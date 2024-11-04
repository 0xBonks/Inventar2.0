<template>
  <div class="dashboard">
    <!-- Header -->
    <div class="border-bottom">
      <div class="d-flex align-items-center px-4" style="height: 4rem;">
        <div class="d-flex align-items-center">
          <font-awesome-icon icon="box" class="mr-2 h5 mb-0"/>
          <h2 class="h5 mb-0">Inventory Dashboard</h2>
        </div>
      </div>
    </div>

    <div class="p-4">
      <!-- Overview Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="h3 font-weight-bold">Overview</h2>
        <div class="d-flex align-items-center">
          <b-button-group size="sm" class="mr-4">
            <b-button
              v-for="period in periodOptions"
              :key="period.value"
              :variant="selectedPeriod === period.value ? 'primary' : 'outline-primary'"
              @click="selectedPeriod = period.value"
              class="period-button"
            >
              {{ period.text }}
            </b-button>
          </b-button-group>
          <b-button size="sm" variant="primary">
            <font-awesome-icon icon="download" class="mr-2"/>
            Download
          </b-button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="row mb-4">
        <div class="col-md-3" v-for="item in inventoryOverview" :key="item.name">
          <b-card class="mb-3">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <h6 class="mb-0">{{ item.name }}</h6>
              <font-awesome-icon :icon="item.icon" class="text-muted"/>
            </div>
            <div class="h3 mb-0">
              {{ formatValue(item) }}
            </div>
            <small :class="getPercentageClass(item.percentage)">
              <font-awesome-icon :icon="getPercentageIcon(item.percentage)" class="mr-1"/>
              {{ item.percentage }}% from last month
            </small>
          </b-card>
        </div>
      </div>

      <!-- Charts and Activities -->
      <div class="row mb-4">
        <div class="col-lg-8">
          <b-card>
            <template #header>
              <h6 class="mb-0">Monthly Sales</h6>
            </template>
            <div style="height: 350px;">
              <bar-chart :chart-data="monthlySalesData" :options="chartOptions"/>
            </div>
          </b-card>
        </div>
        <div class="col-lg-4">
          <b-card>
            <template #header>
              <h6 class="mb-0">Recent Activities</h6>
              <small class="text-muted">
                You have {{ recentActivities.length }} activities this month
              </small>
            </template>
            <div class="activity-list">
              <div v-for="activity in recentActivities" :key="activity.id" 
                   class="d-flex align-items-center p-3 border-bottom">
                <font-awesome-icon icon="box" class="mr-3 text-primary"/>
                <div>
                  <p class="mb-0">{{ activity.action }}</p>
                  <small class="text-muted">{{ activity.timestamp }}</small>
                </div>
                <div v-if="activity.quantity" class="ml-auto">
                  +{{ activity.quantity }}
                </div>
                <div v-if="activity.oldPrice" class="ml-auto text-muted">
                  {{ activity.oldPrice }} → {{ activity.newPrice }}
                </div>
              </div>
            </div>
          </b-card>
        </div>
      </div>

      <!-- Low Stock and Quick Actions -->
      <div class="row">
        <div class="col-lg-8">
          <b-card>
            <template #header>
              <h6 class="mb-0">Low Stock Alerts</h6>
              <small class="text-muted">Items that need to be restocked soon</small>
            </template>
            <b-table
              :items="lowStockItems"
              :fields="lowStockFields"
              striped
              hover
              small
            >
              <template #cell(actions)="data">
                <b-button size="sm" variant="outline-primary" @click="handleReorder(data.item)">Reorder</b-button>
              </template>
            </b-table>
          </b-card>
        </div>
        <div class="col-lg-4">
          <b-card>
            <template #header>
              <h6 class="mb-0">Quick Actions</h6>
              <small class="text-muted">Frequently used inventory management tasks</small>
            </template>
            <div class="d-grid gap-2">
              <b-button variant="primary" class="d-flex align-items-center justify-content-center">
                <font-awesome-icon icon="plus" class="mr-2"/>
                Add New Item
              </b-button>
              <b-button variant="outline-primary" class="d-flex align-items-center justify-content-center">
                <font-awesome-icon icon="sync" class="mr-2"/>
                Update Stock
              </b-button>
              <b-button variant="secondary" class="d-flex align-items-center justify-content-center">
                <font-awesome-icon icon="chart-bar" class="mr-2"/>
                Generate Report
              </b-button>
            </div>
          </b-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Bar } from 'vue-chartjs'
import { mapState } from 'vuex'

export default {
  name: 'Dashboard',
  components: {
    BarChart: {
      extends: Bar,
      props: ['chartData', 'options'],
      mounted() {
        this.renderChart(this.chartData, this.options)
      },
      watch: {
        chartData: {
          handler() {
            this.renderChart(this.chartData, this.options)
          },
          deep: true
        }
      }
    }
  },
  data() {
    return {
      selectedPeriod: 'This Month',
      periodOptions: [
        { value: 'This Week', text: 'This Week' },
        { value: 'This Month', text: 'This Month' },
        { value: 'This Year', text: 'This Year' }
      ],
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              callback: value => `$${value}`
            }
          }]
        }
      },
      lowStockFields: [
        { key: 'name', label: 'Item' },
        { key: 'currentStock', label: 'Current Stock' },
        { key: 'minStockLevel', label: 'Min Stock Level' },
        { key: 'actions', label: 'Action' }
      ]
    }
  },
  computed: {
    ...mapState(['inventory']),
    sales() {
      // Get sales data from inventory items
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
    monthlySalesData() {
      // Group sales by month
      const monthlyData = this.sales.reduce((acc, sale) => {
        const month = new Date(sale.date).toLocaleString('default', { month: 'short' });
        acc[month] = (acc[month] || 0) + sale.totalSale;
        return acc;
      }, {});

      return {
        labels: Object.keys(monthlyData),
        datasets: [{
          label: 'Monthly Sales',
          data: Object.values(monthlyData),
          backgroundColor: '#000000'
        }]
      };
    },
    inventoryStats() {
      const totalSales = this.sales.reduce((sum, sale) => sum + sale.totalSale, 0);
      const lastMonthSales = totalSales * 0.8; // Example: last month's sales were 80% of current

      const currentStats = {
        totalItems: this.inventory.length,
        lowStock: this.inventory.filter(item => item.status === 'Low').length,
        outOfStock: this.inventory.filter(item => item.status === 'Out').length,
        totalValue: totalSales
      };

      // Calculate percentages based on previous month's data
      const previousStats = {
        totalItems: currentStats.totalItems * 0.9,
        lowStock: currentStats.lowStock * 1.1,
        outOfStock: currentStats.outOfStock * 1.2,
        totalValue: lastMonthSales
      };

      return {
        totalItems: {
          value: currentStats.totalItems,
          percentage: this.calculatePercentageChange(previousStats.totalItems, currentStats.totalItems)
        },
        lowStock: {
          value: currentStats.lowStock,
          percentage: this.calculatePercentageChange(previousStats.lowStock, currentStats.lowStock)
        },
        outOfStock: {
          value: currentStats.outOfStock,
          percentage: this.calculatePercentageChange(previousStats.outOfStock, currentStats.outOfStock)
        },
        totalValue: {
          value: currentStats.totalValue,
          percentage: this.calculatePercentageChange(previousStats.totalValue, currentStats.totalValue)
        }
      };
    },
    inventoryOverview() {
      return [
        { 
          name: 'Total Items', 
          value: this.inventoryStats.totalItems.value, 
          percentage: this.inventoryStats.totalItems.percentage,
          icon: 'box' 
        },
        { 
          name: 'Low Stock', 
          value: this.inventoryStats.lowStock.value, 
          percentage: this.inventoryStats.lowStock.percentage,
          icon: 'exclamation-circle' 
        },
        { 
          name: 'Out of Stock', 
          value: this.inventoryStats.outOfStock.value, 
          percentage: this.inventoryStats.outOfStock.percentage,
          icon: 'shopping-cart' 
        },
        { 
          name: 'Total Value', 
          value: this.inventoryStats.totalValue.value, 
          percentage: this.inventoryStats.totalValue.percentage,
          icon: 'dollar-sign' 
        }
      ];
    },
    lowStockItems() {
      return this.inventory
        .filter(item => item.status === 'Low' || item.status === 'Out')
        .slice(0, 4)
        .map(item => ({
          id: item.item_id,
          name: item.name,
          currentStock: item.quantity,
          minStockLevel: 10 // You might want to add this to your inventory model
        }))
    },
    recentActivities() {
      // Get the most recent sales and convert them to activities
      return this.sales
        .slice(0, 4)
        .map(sale => ({
          id: sale.id,
          action: `Sold ${sale.quantity} units of ${sale.product}`,
          quantity: sale.quantity,
          timestamp: 'Just now',
          customer: sale.customer,
          value: sale.totalSale
        }));
    }
  },
  watch: {
    selectedPeriod: {
      handler(newPeriod) {
        // Update chart data based on selected period
        const periodData = this.filterSalesByPeriod(newPeriod);
        this.updateChartData(periodData);
      },
      immediate: true
    }
  },
  created() {
    // Fetch inventory data when component is created
    this.$store.dispatch('fetchInventory')
  },
  methods: {
    formatValue(item) {
      return item.name === 'Total Value' 
        ? `$${item.value.toLocaleString()}`
        : item.value.toLocaleString()
    },
    async handleReorder(item) {
      try {
        await this.$store.dispatch('updateInventoryItem', {
          id: item.id,
          data: {
            ...item,
            quantity: item.minStockLevel,
            status: 'In Stock'
          }
        })
        this.$bvToast.toast('Item reordered successfully', {
          title: 'Success',
          variant: 'success',
          solid: true
        })
      } catch (error) {
        this.$bvToast.toast('Failed to reorder item', {
          title: 'Error',
          variant: 'danger',
          solid: true
        })
      }
    },
    calculatePercentageChange(oldValue, newValue) {
      return ((newValue - oldValue) / oldValue * 100).toFixed(1);
    },
    getPercentageClass(percentage) {
      return percentage > 0 ? 'text-success' : percentage < 0 ? 'text-danger' : 'text-muted';
    },
    getPercentageIcon(percentage) {
      return percentage > 0 ? 'arrow-up' : percentage < 0 ? 'arrow-down' : 'minus';
    },
    filterSalesByPeriod(period) {
      const now = new Date();
      const sales = [...this.sales];
      let filteredSales;
      
      switch(period) {
        case 'This Week': {
          const weekAgo = new Date(now.setDate(now.getDate() - 7));
          filteredSales = sales.filter(sale => new Date(sale.date) >= weekAgo);
          break;
        }
        case 'This Month': {
          const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
          filteredSales = sales.filter(sale => new Date(sale.date) >= monthAgo);
          break;
        }
        case 'This Year': {
          const yearAgo = new Date(now.setFullYear(now.getFullYear() - 1));
          filteredSales = sales.filter(sale => new Date(sale.date) >= yearAgo);
          break;
        }
        default:
          filteredSales = sales;
      }
      
      return filteredSales;
    },
    updateChartData(periodSales) {
      // Group sales by date within the selected period
      const salesByDate = periodSales.reduce((acc, sale) => {
        const date = sale.date;
        acc[date] = (acc[date] || 0) + sale.totalSale;
        return acc;
      }, {});

      this.monthlySalesData = {
        labels: Object.keys(salesByDate),
        datasets: [{
          label: 'Sales',
          data: Object.values(salesByDate),
          backgroundColor: '#000000'
        }]
      };
    }
  }
}
</script>

<style scoped>
.dashboard {
  background-color: #f8f9fa;
  min-height: 100vh;
}

.border-bottom {
  border-bottom: 1px solid #dee2e6;
}

.activity-list {
  max-height: 350px;
  overflow-y: auto;
}

.activity-list .border-bottom:last-child {
  border-bottom: none !important;
}

.d-grid {
  display: grid;
  gap: 0.5rem;
}

.d-grid .btn {
  width: 100%;
}

.period-button {
  padding: 0.5rem 1rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.period-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.period-button.btn-primary {
  background-color: #3b82f6;
  border-color: #3b82f6;
}

.period-button.btn-outline-primary {
  color: #3b82f6;
  border-color: #3b82f6;
}

.period-button.btn-outline-primary:hover {
  background-color: #3b82f6;
  color: white;
}

.text-success {
  color: #22c55e !important;
}

.text-danger {
  color: #ef4444 !important;
}

.text-muted {
  color: #6b7280 !important;
}
</style> 