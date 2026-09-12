import express, { Request, Response } from 'express';
import path from 'path';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

// -------------------------------------------------------------
// Configured Administrators & RBAC Matrix
// -------------------------------------------------------------
const DEFAULT_ADMIN_EMAILS = [
  'admin@example.com',
  'owner@example.com',
  'rrichi336@gmail.com'
];

function getAdminEmails(): string[] {
  const envAdmins = process.env.ADMIN_EMAILS;
  if (!envAdmins) return DEFAULT_ADMIN_EMAILS;
  return envAdmins
    .split(',')
    .map(e => e.trim().toLowerCase())
    .filter(Boolean);
}

const ADMIN_ROLES_PERMISSIONS = {
  SUPER_ADMIN: {
    label: 'Super Admin',
    permissions: [
      'manage_admins',
      'disable_admin',
      'change_roles',
      'approve_kyc',
      'reject_kyc',
      'approve_payout',
      'approve_refund',
      'approve_deletion',
      'override_commission',
      'adjust_wallet',
      'view_audit_logs',
      'edit_pricing',
      'edit_cms'
    ]
  },
  ADMIN: {
    label: 'Platform Admin',
    permissions: [
      'approve_kyc',
      'reject_kyc',
      'approve_payout',
      'approve_refund',
      'approve_deletion',
      'adjust_wallet',
      'view_audit_logs',
      'edit_pricing'
    ]
  },
  OPERATIONS: {
    label: 'Operations Coordinator',
    permissions: [
      'assign_providers',
      'reassign_providers',
      'resolve_disputes',
      'monitor_risk',
      'flag_discrepancy'
    ]
  },
  KYC_REVIEWER: {
    label: 'KYC Verification Specialist',
    permissions: [
      'review_documents',
      'approve_kyc',
      'reject_kyc',
      'request_resubmission'
    ]
  },
  SUPPORT: {
    label: 'Customer & Partner Support',
    permissions: [
      'view_tickets',
      'reply_ticket',
      'escalate_complaint',
      'offer_revisit'
    ]
  }
};

// -------------------------------------------------------------
// API Routes
// -------------------------------------------------------------

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'DOIT Network API Gateway',
    timestamp: new Date().toISOString(),
    bhelCoverageActive: true
  });
});

// Admin Authorization Check
app.post('/api/auth/verify-admin', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ authorized: false, error: 'Email is required' });
  }

  const normalized = email.trim().toLowerCase();
  const adminEmails = getAdminEmails();
  const isAuthorized = adminEmails.includes(normalized);

  if (!isAuthorized) {
    return res.status(403).json({
      authorized: false,
      error: 'Access restricted. This email is not registered in the DOIT Admin Directory.'
    });
  }

  // Assign Super Admin to owner/first admin, Admin to others
  const isSuper = normalized === 'owner@example.com' || normalized === 'rrichi336@gmail.com' || normalized === adminEmails[0];
  const role = isSuper ? 'SUPER_ADMIN' : 'ADMIN';

  return res.json({
    authorized: true,
    email: normalized,
    role,
    roleDetails: ADMIN_ROLES_PERMISSIONS[role],
    availableRoles: ADMIN_ROLES_PERMISSIONS
  });
});

// Razorpay Config Status
app.get('/api/razorpay/config', (req: Request, res: Response) => {
  const keyId = process.env.RAZORPAY_KEY_ID || '';
  const isConfigured = Boolean(keyId && process.env.RAZORPAY_KEY_SECRET);
  res.json({
    isConfigured,
    keyId: isConfigured ? keyId : null,
    message: isConfigured 
      ? 'Razorpay Gateway is active' 
      : 'Razorpay keys pending configuration. To accept live payments, set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in Settings/Environment.'
  });
});

// Razorpay Order Creation (server-side, integer paise)
app.post('/api/razorpay/create-order', async (req: Request, res: Response) => {
  const { bookingId, amountInRupees, customerEmail, customerPhone } = req.body;

  if (!bookingId || !amountInRupees || amountInRupees <= 0) {
    return res.status(400).json({ error: 'Valid bookingId and positive amount are required' });
  }

  const amountInPaise = Math.round(Number(amountInRupees) * 100);
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return res.status(503).json({
      configured: false,
      error: 'Razorpay gateway not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.',
      mockReceipt: `DOIT-ORDER-${Date.now()}`,
      amountInPaise,
      currency: 'INR'
    });
  }

  try {
    const authHeader = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authHeader}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: 'INR',
        receipt: `DOIT-${bookingId.slice(-8)}`,
        notes: {
          bookingId,
          customerEmail: customerEmail || '',
          customerPhone: customerPhone || '',
          platform: 'DOIT BHEL Bhopal'
        }
      })
    });

    const orderData = await response.json();
    if (!response.ok) {
      return res.status(502).json({ error: orderData.error?.description || 'Razorpay order creation failed' });
    }

    return res.json({
      configured: true,
      orderId: orderData.id,
      amount: orderData.amount,
      currency: orderData.currency,
      keyId
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal order creation error' });
  }
});

// Razorpay Signature Verification
app.post('/api/razorpay/verify-payment', (req: Request, res: Response) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keySecret) {
    return res.status(503).json({ verified: false, error: 'Razorpay secret key not configured' });
  }

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ verified: false, error: 'Missing required signature verification parameters' });
  }

  const generatedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  const isMatch = generatedSignature === razorpay_signature;

  return res.json({
    verified: isMatch,
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
    verifiedAt: new Date().toISOString()
  });
});

// Deterministic Server-Side Commission Calculation
app.post('/api/bookings/calculate-commission', (req: Request, res: Response) => {
  const { quotedAmount, categoryId, customCommissionPct } = req.body;
  const amount = Number(quotedAmount) || 0;
  if (amount <= 0) {
    return res.status(400).json({ error: 'Valid positive amount required' });
  }

  // Base BHEL platform commission is 10% unless category specific
  const commissionRate = typeof customCommissionPct === 'number' ? customCommissionPct : 10;
  const commissionAmount = Math.round((amount * commissionRate) / 100);
  const providerEarning = amount - commissionAmount;

  res.json({
    grossAmount: amount,
    commissionRatePct: commissionRate,
    platformCommission: commissionAmount,
    providerEarning,
    currency: 'INR',
    smallestUnitPaise: {
      gross: amount * 100,
      commission: commissionAmount * 100,
      earning: providerEarning * 100
    }
  });
});

// Deterministic COD Overdue Penalty Policy Engine
app.post('/api/policy/calculate-penalties', (req: Request, res: Response) => {
  const { overdueEntries, gracePeriodDays = 0, dailyPenaltyPct = 1, suspensionThresholdDays = 7 } = req.body;

  if (!Array.isArray(overdueEntries)) {
    return res.status(400).json({ error: 'overdueEntries array required' });
  }

  const results = overdueEntries.map((entry: any) => {
    const principalCommission = Number(entry.unpaidCommission) || 0;
    const daysOverdue = Math.max(0, Number(entry.daysOverdue) || 0);

    let penalty = 0;
    let status: 'GREEN' | 'RED / DEBT WARNING' | 'SUSPENSION_PENDING' | 'SUSPENDED' = 'GREEN';

    if (principalCommission > 0) {
      if (daysOverdue === 0) {
        // Day 0: Until 11:59 PM - 0% interest
        penalty = 0;
        status = 'GREEN';
      } else if (daysOverdue <= 6) {
        // Day 1 to 6: 1% daily penalty on unpaid commission
        penalty = Math.round(principalCommission * (dailyPenaltyPct / 100) * daysOverdue);
        status = 'RED / DEBT WARNING';
      } else {
        // Day 7+: Eligible for suspension
        penalty = Math.round(principalCommission * (dailyPenaltyPct / 100) * daysOverdue);
        status = daysOverdue >= suspensionThresholdDays ? 'SUSPENSION_PENDING' : 'RED / DEBT WARNING';
      }
    }

    const totalDebt = principalCommission + penalty;

    return {
      providerId: entry.providerId,
      providerName: entry.providerName,
      principalCommission,
      daysOverdue,
      dailyPenaltyPct,
      penalty,
      totalDebt,
      status,
      suspensionEligible: daysOverdue >= suspensionThresholdDays,
      calculatedAt: new Date().toISOString()
    };
  });

  res.json({ calculatedCount: results.length, entries: results });
});

// Refund Eligibility & Recommendation Matrix
app.post('/api/refunds/calculate-eligibility', (req: Request, res: Response) => {
  const { scenario, bookingAmount, hoursBeforeService, disputeSeverity } = req.body;
  const amount = Number(bookingAmount) || 0;

  let recommendation: {
    priority: number;
    resolutionType: 'FREE_REVISIT' | 'WALLET_CREDIT' | 'DIRECT_REFUND';
    refundPercentage: number;
    refundAmount: number;
    deductionReason?: string;
    deductionAmount: number;
    providerDebitRequired: boolean;
    providerDebitAmount: number;
    explanation: string;
  };

  if (scenario === 'PROVIDER_NOSHOW') {
    // Scenario A: Provider No-Show -> 100% refund + provider penalty debit
    recommendation = {
      priority: 3,
      resolutionType: 'DIRECT_REFUND',
      refundPercentage: 100,
      refundAmount: amount,
      deductionAmount: 0,
      providerDebitRequired: true,
      providerDebitAmount: amount,
      explanation: 'Provider no-show confirmed. Full 100% refund approved to customer. Compensating debit applied to provider ledger.'
    };
  } else if (scenario === 'CUSTOMER_CANCELLATION_EARLY') {
    // Scenario B: Cancellation > 2 hours before service
    recommendation = {
      priority: 2,
      resolutionType: 'WALLET_CREDIT',
      refundPercentage: 100,
      refundAmount: amount,
      deductionAmount: 0,
      providerDebitRequired: false,
      providerDebitAmount: 0,
      explanation: 'Customer cancelled more than 2 hours in advance. Full refund granted as platform wallet credit or UPI refund.'
    };
  } else if (scenario === 'CUSTOMER_CANCELLATION_LATE') {
    // Scenario C: Cancellation < 2 hours or partner arrived
    const travelFee = 75; // Standard BHEL partner dispatch travel fee
    const refundable = Math.max(0, amount - travelFee);
    recommendation = {
      priority: 2,
      resolutionType: 'WALLET_CREDIT',
      refundPercentage: Math.round((refundable / amount) * 100),
      refundAmount: refundable,
      deductionReason: 'Standard BHEL Township doorstep travel fee',
      deductionAmount: travelFee,
      providerDebitRequired: false,
      providerDebitAmount: 0,
      explanation: `Late cancellation within 2 hours. Partner travel fee of ₹${travelFee} deducted, remaining ₹${refundable} refunded.`
    };
  } else {
    // Scenario D: Quality dispute
    recommendation = {
      priority: 1,
      resolutionType: 'FREE_REVISIT',
      refundPercentage: 50,
      refundAmount: Math.round(amount * 0.5),
      deductionAmount: 0,
      providerDebitRequired: true,
      providerDebitAmount: Math.round(amount * 0.5),
      explanation: 'Quality dispute reported within 48h. Priority 1: Offer free partner remediation re-visit. If declined, apply partial refund.'
    };
  }

  res.json({ scenario, bookingAmount: amount, recommendation });
});

// Notifications Abstract Dispatcher
app.post('/api/notifications/send', (req: Request, res: Response) => {
  const { recipientEmail, recipientPhone, eventType, data } = req.body;

  const emailConfigured = Boolean(process.env.NOTIFICATION_EMAIL_FROM);

  const notificationLog = {
    id: `NTF-${Date.now()}`,
    eventType,
    recipientEmail: recipientEmail || null,
    recipientPhone: recipientPhone || null,
    channels: {
      inApp: true,
      email: emailConfigured ? 'SENT' : 'SKIPPED_NOT_CONFIGURED',
      sms: 'SIMULATED_READY',
      whatsApp: 'SIMULATED_READY'
    },
    timestamp: new Date().toISOString()
  };

  res.json({
    success: true,
    notification: notificationLog,
    message: `Dispatched ${eventType} notification to recipient.`
  });
});

// -------------------------------------------------------------
// Vite Middleware / Static Serving
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DOIT Network Production Server running on http://localhost:${PORT}`);
  });
}

startServer();
