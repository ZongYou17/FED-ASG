document.addEventListener('DOMContentLoaded', function() {
    // Navigation highlight
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Highlight active nav item
    navLinks.forEach(link => {
        if (link.getAttribute('href') === 'vendor-dashboard.html') {
            link.style.background = '#0066cc';
            link.style.color = 'white';
            link.style.borderColor = '#0066cc';
        }
        
        link.addEventListener('click', function() {
            // Reset all nav links
            navLinks.forEach(l => {
                l.style.background = '#f0f0f0';
                l.style.color = '#333';
                l.style.borderColor = '#ccc';
            });
            
            // Highlight clicked link
            this.style.background = '#0066cc';
            this.style.color = 'white';
            this.style.borderColor = '#0066cc';
        });
    });
    
    // Sales data for the chart
    const salesData = [
        { day: 'MON', value: 1300 },
        { day: 'TUE', value: 1000 },
        { day: 'WED', value: 1400 },
        { day: 'THU', value: 1200 },
        { day: 'FRI', value: 1700 },
        { day: 'SAT', value: 1500 },
        { day: 'SUN', value: 1600 }
    ];
    
    // Format value to display as K
    function formatValue(value) {
        return `$${(value / 1000).toFixed(1)}k`;
    }
    
    // Create sales chart
    function createSalesChart() {
        const salesChart = document.querySelector('.sales-chart');
        if (!salesChart) return;
        
        // Clear any existing content
        salesChart.innerHTML = '';
        
        // Create bars for each day
        salesData.forEach(item => {
            const barContainer = document.createElement('div');
            barContainer.className = 'chart-bar-container';
            
            // Value above the bar
            const valueLabel = document.createElement('div');
            valueLabel.className = 'chart-bar-value';
            valueLabel.textContent = formatValue(item.value);
            
            // The bar
            const bar = document.createElement('div');
            bar.className = 'chart-bar';
            
            // Set different heights for each bar based on value
            if (item.value === 1700) bar.style.height = '95%';      // FRI - tallest
            else if (item.value === 1600) bar.style.height = '85%'; // SUN
            else if (item.value === 1500) bar.style.height = '80%'; // SAT
            else if (item.value === 1400) bar.style.height = '70%'; // WED
            else if (item.value === 1300) bar.style.height = '65%'; // MON
            else if (item.value === 1200) bar.style.height = '60%'; // THU
            else if (item.value === 1000) bar.style.height = '45%'; // TUE - shortest
            
            // Day below the bar
            const dayLabel = document.createElement('div');
            dayLabel.className = 'chart-day';
            dayLabel.textContent = item.day;
            
            // Append in correct order
            barContainer.appendChild(valueLabel);
            barContainer.appendChild(bar);
            barContainer.appendChild(dayLabel);
            
            salesChart.appendChild(barContainer);
        });
    }
    
    // Initialize dashboard
    createSalesChart();
});