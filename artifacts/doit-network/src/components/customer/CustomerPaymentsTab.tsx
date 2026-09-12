import React, { useState } from 'react';
import { Booking } from '../../types/doit';
import { CreditCard, CheckCircle2, Clock, AlertCircle, ShieldCheck, Download, ExternalLink } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

interface CustomerPaymentsTabProps {
  bookings: Booking[];
}

export const CustomerPaymentsTab: React.FC<CustomerPaymentsTabProps> = ({ bookings }) => {
  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[#00c29e]" />
            Payment History & Invoices
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Transparent billing. Support for Prepaid (Razorpay, UPI, Cards) and verified Cash On Delivery.
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center gap-2 text-xs">
          <ShieldCheck className="w-4 h-4 text-[#00c29e]" />
          <span className="font-semibold text-zinc-700">Razorpay Gateway Enabled</span>
        </div>
      </div>

      {/* Payment Transactions */}
      <div className="space-y-3">
        {bookings.map((booking) => {
          const amount = booking.quote?.totalAmount || booking.expectedBudget || 350;
          const isPaid = booking.paymentStatus === 'PAID';
          const method = booking.paymentMethod || 'COD';

          return (
            <Card key={booking.id} className="border-zinc-200 shadow-2xs">
              <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-zinc-900">{booking.id}</span>
                    <Badge variant={isPaid ? 'success' : 'warning'}>
                      {isPaid ? 'PAID' : booking.paymentStatus || 'PENDING'}
                    </Badge>
                    <Badge variant="outline" className="text-[10px]">
                      {method}
                    </Badge>
                  </div>
                  <h4 className="text-xs font-bold text-zinc-900">
                    {booking.subService} — {booking.locality}
                  </h4>
                  <p className="text-[11px] text-zinc-500">
                    Scheduled: {booking.preferredDate} at {booking.preferredTime}
                  </p>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-center">
                  <div className="text-right">
                    <span className="text-xs text-zinc-400 block">Total Amount</span>
                    <span className="text-base font-bold text-zinc-900">₹{amount}</span>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs cursor-pointer"
                    onClick={() => alert(`Official GST tax receipt for ${booking.id} downloaded.`)}
                  >
                    <Download className="w-3.5 h-3.5 mr-1.5" />
                    Receipt
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
