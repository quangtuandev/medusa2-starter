import type { LoaderFunctionArgs } from 'react-router';
import { data } from 'react-router';
import { listBankAccounts } from '@libs/util/server/data/payment.server';
export async function loader({ request }: LoaderFunctionArgs) {
    const bankAccounts = await listBankAccounts();
    return data(bankAccounts, { status: 200 });
}

