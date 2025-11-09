import { initiatePaymentSession, retrieveCart } from '@libs/util/server/data/cart.server';
import type { ActionFunctionArgs } from 'react-router';
import { data as remixData } from 'react-router';

export async function action(actionArgs: ActionFunctionArgs) {
    const formData = await actionArgs.request.formData();
    const providerId = formData.get('provider_id') as string;
    const bankAccountId = formData.get('bank_account_id') as string | null;

    if (!providerId) {
        return remixData({ error: 'Provider ID is required' }, { status: 400 });
    }

    const cart = await retrieveCart(actionArgs.request);
    if (!cart) {
        return remixData({ error: 'Cart not found' }, { status: 404 });
    }

    // Prepare payment session data
    const paymentSessionData: {
        provider_id: string;
        data?: Record<string, unknown>;
    } = {
        provider_id: providerId,
    };

    // Add bank_account_id to context if provided
    if (bankAccountId && providerId === 'pp_bank_transfer_bank_transfer') {
        paymentSessionData.data = {
            bank_account_id: bankAccountId,
        };
    }

    try {
        const result = await initiatePaymentSession(actionArgs.request, cart, paymentSessionData);
        return remixData({ payment_collection: result.payment_collection });
    } catch (error: any) {
        console.error('Error initiating payment session:', error);
        return remixData(
            { error: error.message || 'Failed to initiate payment session' },
            { status: 500 }
        );
    }
}

