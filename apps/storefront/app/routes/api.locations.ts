import type { LoaderFunctionArgs } from 'react-router';
import { data } from 'react-router';
import { listLocations } from '@libs/util/server/data/locations.server';
export async function loader({ request }: LoaderFunctionArgs) {
    const locations = await listLocations();
    return data(locations, { status: 200 });
}

