import { Cashfree, CFEnvironment } from 'cashfree-pg';

interface CashfreeConfig {
  appId: string;
  secretKey: string;
  environment: 'sandbox' | 'production';
  returnUrl: string;
}

interface CreateOrderParams {
  orderId: string;
  orderAmount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

interface CreateOrderResult {
  paymentSessionId: string;
  orderId: string;
}

interface PaymentVerificationResult {
  success: boolean;
  status: string;
  orderId?: string;
  transactionId?: string;
  amount?: number;
  paymentMethod?: string;
  bankReference?: string;
  gatewayResponse?: any;
}

interface RefundResult {
  success: boolean;
  refundId?: string;
  status?: string;
  gatewayResponse?: any;
}

interface RefundStatusResult {
  success: boolean;
  status?: string;
  amount?: number;
  gatewayResponse?: any;
}

interface RefundsListResult {
  success: boolean;
  refunds?: any[];
  gatewayResponse?: any;
}

class CashfreeService {
  private config: CashfreeConfig | null = null;
  private configError: string | null = null;
  private cashfree: Cashfree | null = null;

  constructor() {
    try {
      const requiredVars = [
        'CASHFREE_APP_ID',
        'CASHFREE_SECRET_KEY',
      ];

      const missing = requiredVars.filter((v) => !process.env[v]);
      if (missing.length > 0) {
        this.configError = `Missing required Cashfree environment variables: ${missing.join(', ')}`;
        console.warn(`Cashfree not configured: ${this.configError}`);
        return;
      }

      const env = (process.env.CASHFREE_ENV || 'sandbox') as 'sandbox' | 'production';

      this.config = {
        appId: process.env.CASHFREE_APP_ID!,
        secretKey: process.env.CASHFREE_SECRET_KEY!,
        environment: env,
        returnUrl: process.env.CASHFREE_RETURN_URL || 'http://localhost:3000/api/payment/callback',
      };

      this.cashfree = new Cashfree(
        env === 'production' ? CFEnvironment.PRODUCTION : CFEnvironment.SANDBOX,
        this.config.appId,
        this.config.secretKey
      );

      console.log(`Cashfree payment gateway configured (${env})`);
    } catch (error: any) {
      this.configError = error.message;
      console.error('Error initializing Cashfree service:', error);
    }
  }

  private ensureConfigured(): void {
    if (!this.config || !this.cashfree) {
      throw new Error(
        this.configError || 'Cashfree payment gateway is not configured.'
      );
    }
  }

  /**
   * Create a Cashfree order and get payment session ID
   */
  async createOrder(params: CreateOrderParams): Promise<CreateOrderResult> {
    this.ensureConfigured();

    const request = {
      order_amount: params.orderAmount,
      order_currency: 'INR',
      order_id: params.orderId,
      customer_details: {
        customer_id: params.orderId,
        customer_name: params.customerName,
        customer_email: params.customerEmail,
        customer_phone: params.customerPhone,
      },
      order_meta: {
        return_url: `${this.config!.returnUrl}?order_id={order_id}`,
      },
    };

    try {
      const response = await this.cashfree!.PGCreateOrder(request);
      const data = response.data;

      if (!data?.payment_session_id) {
        throw new Error('No payment_session_id returned from Cashfree');
      }

      return {
        paymentSessionId: data.payment_session_id,
        orderId: data.order_id || params.orderId,
      };
    } catch (error: any) {
      console.error('Error creating Cashfree order:', error?.response?.data || error);
      const message = error?.response?.data?.message || error.message || 'Failed to create payment order';
      throw new Error(message);
    }
  }

  /**
   * Verify payment status by fetching the order from Cashfree
   */
  async verifyPayment(orderId: string): Promise<PaymentVerificationResult> {
    this.ensureConfigured();

    try {
      const response = await this.cashfree!.PGFetchOrder(orderId);
      const data = response.data;

      const orderStatus = data?.order_status;
      const success = orderStatus === 'PAID';

      // Fetch actual payment details to get payment method
      let paymentMethod: string | undefined = (data as any)?.payment_group;
      let transactionId = data?.cf_order_id?.toString();
      let bankReference: string | undefined = (data as any)?.bank_reference;

      if (success) {
        try {
          const paymentsResponse = await this.cashfree!.PGOrderFetchPayments(orderId);
          const payments = paymentsResponse.data as any;
          if (Array.isArray(payments) && payments.length > 0) {
            const successfulPayment = payments.find((p: any) => p.payment_status === 'SUCCESS') || payments[0];
            paymentMethod = successfulPayment?.payment_group || paymentMethod;
            transactionId = successfulPayment?.cf_payment_id?.toString() || transactionId;
            bankReference = successfulPayment?.bank_reference || bankReference;
          }
        } catch (paymentError: any) {
          console.warn('Could not fetch payment details:', paymentError?.message);
        }
      }

      return {
        success,
        status: orderStatus || 'UNKNOWN',
        orderId: data?.order_id,
        transactionId,
        amount: data?.order_amount,
        paymentMethod,
        bankReference,
        gatewayResponse: data,
      };
    } catch (error: any) {
      console.error('Error verifying Cashfree payment:', error?.response?.data || error);
      return { success: false, status: 'VERIFICATION_FAILED' };
    }
  }

  /**
   * Verify webhook signature from Cashfree
   */
  verifyWebhook(signature: string, rawBody: string, timestamp: string): boolean {
    this.ensureConfigured();

    try {
      this.cashfree!.PGVerifyWebhookSignature(signature, rawBody, timestamp);
      return true;
    } catch (error) {
      console.error('Cashfree webhook signature verification failed:', error);
      return false;
    }
  }

  /**
   * Map Cashfree payment group to our payment method
   */
  getPaymentMethod(paymentGroup: string): 'card' | 'upi' | 'netbanking' | 'wallet' {
    const group = (paymentGroup || '').toLowerCase();

    if (group.includes('upi')) return 'upi';
    if (group.includes('card') || group.includes('credit') || group.includes('debit')) return 'card';
    if (group.includes('net_banking') || group.includes('netbanking') || group.includes('net')) return 'netbanking';
    if (group.includes('wallet') || group.includes('app')) return 'wallet';

    return 'card';
  }

  /**
   * Map Cashfree order status to our payment status
   */
  getPaymentStatus(status: string): 'success' | 'failed' | 'pending' {
    switch (status) {
      case 'PAID': return 'success';
      case 'EXPIRED':
      case 'CANCELLED':
      case 'VOID': return 'failed';
      case 'ACTIVE': return 'pending';
      default: return 'failed';
    }
  }

  /**
   * Initiate a refund for a paid order via Cashfree gateway
   * @param orderId - Cashfree order ID (our order number)
   * @param refundAmount - Amount to refund in INR
   * @param refundId - Unique refund ID for idempotency
   * @param refundNote - Optional note for the refund
   */
  async refundOrder(params: {
    orderId: string;
    refundAmount: number;
    refundId: string;
    refundNote?: string;
  }): Promise<RefundResult> {
    this.ensureConfigured();

    try {
      const request = {
        refund_amount: params.refundAmount,
        refund_id: params.refundId,
        refund_note: params.refundNote || 'Refund initiated by admin',
      };

      const response = await this.cashfree!.PGOrderCreateRefund(params.orderId, request);
      const data = response.data as any;

      if (!data?.refund_id) {
        throw new Error('No refund_id returned from Cashfree');
      }

      return {
        success: true,
        refundId: data.refund_id,
        status: data.refund_status || 'PENDING',
        gatewayResponse: data,
      };
    } catch (error: any) {
      console.error('Error initiating Cashfree refund:', error?.response?.data || error);
      const message = error?.response?.data?.message || error.message || 'Failed to initiate refund';
      throw new Error(message);
    }
  }

  /**
   * Fetch refund status from Cashfree
   * @param orderId - Cashfree order ID (our order number)
   * @param refundId - Merchant's refund ID
   */
  async getRefund(
    orderId: string,
    refundId: string
  ): Promise<RefundStatusResult> {
    this.ensureConfigured();

    try {
      const response = await this.cashfree!.PGOrderFetchRefund(orderId, refundId);
      const data = response.data as any;

      return {
        success: true,
        status: data.refund_status || 'UNKNOWN',
        amount: data.refund_amount,
        gatewayResponse: data,
      };
    } catch (error: any) {
      console.error('Error fetching Cashfree refund:', error?.response?.data || error);
      return { success: false };
    }
  }

  /**
   * Fetch all refunds for an order
   * @param orderId - Cashfree order ID (our order number)
   */
  async getRefunds(
    orderId: string
  ): Promise<RefundsListResult> {
    this.ensureConfigured();

    try {
      const response = await this.cashfree!.PGOrderFetchRefunds(orderId);
      const data = response.data as any;

      return {
        success: true,
        refunds: Array.isArray(data) ? data : [],
        gatewayResponse: data,
      };
    } catch (error: any) {
      console.error('Error fetching Cashfree refunds:', error?.response?.data || error);
      return { success: false, refunds: [] };
    }
  }

}

export const cashfreeService = new CashfreeService();
