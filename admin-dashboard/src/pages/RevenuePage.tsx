///admin-dashboard/src/pages/RevenuePage.tsx`typescript
import React, { useState, useEffect } from 'react';
import { adminApi } from '../services/adminApi';

export default function RevenuePage() {
  const [revenueStats, setRevenueStats] = useState({
    totalRevenue: 0,
    subscriptionRevenue: 0,
    inAppPurchaseRevenue: 0,
    etiTokenRevenue: 0,
    adRevenue: 0,
    ltv: 0,
    arpu: 0,
    conversionRate: 0,
    subscriptionBreakdown: {
      premium: 0,
      gold: 0,
    },
    productBreakdown: [],
  });

  useEffect(() => {
    loadRevenueStats();
  }, []);

  const loadRevenueStats = async () => {
    try {
      const response = await adminApi.get('/revenue/stats');
      setRevenueStats(response.data);
    } catch (error) {
      console.error('Error loading revenue stats:', error);
    }
  };

  return (
    
      Revenue Dashboard

      {/* Total Revenue */}
      
        
          Total Revenue
          
            ${revenueStats.totalRevenue.toLocaleString()}
          
        
        
          Subscriptions
          
            ${revenueStats.subscriptionRevenue.toLocaleString()}
          
        
        
          In-App Purchases
          
            ${revenueStats.inAppPurchaseRevenue.toLocaleString()}
          
        
        
          ETI Token
          
            ${revenueStats.etiTokenRevenue.toLocaleString()}
          
        
      

      {/* Metrics */}
      
        
        
        
      

      {/* Subscription Breakdown */}
      
        Subscription Breakdown
        
          
            Premium ($9.99/mo)
            {revenueStats.subscriptionBreakdown.premium}
            
              ${(revenueStats.subscriptionBreakdown.premium * 9.99).toLocaleString()}/mo
            
          
          
            Gold ($19.99/mo)
            {revenueStats.subscriptionBreakdown.gold}
            
              ${(revenueStats.subscriptionBreakdown.gold * 19.99).toLocaleString()}/mo
            
          
        
      

      {/* Product Sales */}
      
        Product Sales
        
          
            
              Product
              Units Sold
              Revenue
            
          
          
            {revenueStats.productBreakdown.map((product: any) => (
              
                {product.name}
                {product.units}
                ${product.revenue.toLocaleString()}
              
            ))}
          
        
      
    
  );
}

function MetricCard({ title, value }: any) {
  return (
    
      {title}
      {value}
    
  );
}