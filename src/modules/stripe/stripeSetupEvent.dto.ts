/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
export class StripeSetupIntentEvent {
  id: string;
  object: string;
  api_version: string;
  created: number;
  data: {
    object: {
      id: string;
      object: string;
      application: string | null;
      automatic_payment_methods: any | null;
      cancellation_reason: string | null;
      client_secret: string;
      created: number;
      customer: string | null;
      description: string | null;
      flow_directions: any | null;
      last_setup_error: any | null;
      latest_attempt: any | null;
      livemode: boolean;
      mandate: any | null;
      metadata: Record<string, any>;
      next_action: any | null;
      on_behalf_of: string | null;
      payment_method: string;
      payment_method_options: {
        acss_debit: {
          currency: string;
          mandate_options: {
            interval_description: string;
            payment_schedule: string;
            transaction_type: string;
          };
          verification_method: string;
        };
      };
      payment_method_types: string[];
      single_use_mandate: any | null;
      status: string;
      usage: string;
    };
  };
  livemode: boolean;
  pending_webhooks: number;
  request: {
    id: string | null;
    idempotency_key: string | null;
  };
  type: string;
}