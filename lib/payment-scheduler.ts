// Internal scheduler for payment deadline checks
// This runs inside the Next.js application

let schedulerInitialized = false;

export function initializePaymentScheduler() {
  if (schedulerInitialized || process.env.NODE_ENV !== 'production') {
    return;
  }
  
  schedulerInitialized = true;
  
  console.log('Initializing payment deadline scheduler...');
  
  // Run immediately on startup (after 30 seconds delay)
  setTimeout(checkPaymentDeadlines, 30000);
  
  // Schedule to run daily at 6:00 AM
  const scheduleNextRun = () => {
    const now = new Date();
    const next6AM = new Date();
    next6AM.setHours(6, 0, 0, 0);
    
    // If it's already past 6 AM today, schedule for tomorrow
    if (now >= next6AM) {
      next6AM.setDate(next6AM.getDate() + 1);
    }
    
    const msUntilNext6AM = next6AM.getTime() - now.getTime();
    
    console.log(`Next payment check scheduled for: ${next6AM.toISOString()}`);
    
    setTimeout(() => {
      checkPaymentDeadlines();
      scheduleNextRun(); // Schedule the next run
    }, msUntilNext6AM);
  };
  
  scheduleNextRun();
}

async function checkPaymentDeadlines() {
  try {
    console.log('[Scheduler] Running payment deadline check...');
    
    const response = await fetch('http://localhost:3000/api/check-payment-deadlines', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.PAYMENT_CHECK_TOKEN || 'default-secure-token'}`
      }
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('[Scheduler] Payment check completed:', result);
      if (result.revokedCount > 0) {
        console.log(`[Scheduler] ALERT: Revoked ${result.revokedCount} expired allocations`);
      }
    } else {
      console.error('[Scheduler] Payment check failed:', result);
    }
  } catch (error) {
    console.error('[Scheduler] Error during payment check:', error);
  }
}
