import dotenv from 'dotenv';
dotenv.config();
import { NodeSDK } from '@opentelemetry/sdk-node';
import { HoneycombSDK } from '@honeycombio/opentelemetry-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';

const sdk: NodeSDK = new HoneycombSDK({
    apiKey: process.env.HONEYCOMB_API_KEY,
    serviceName: process.env.OTEL_SERVICE_NAME,
    instrumentations: [
        getNodeAutoInstrumentations({
        '@opentelemetry/instrumentation-fs': {
            enabled: false,
        },
        }),
    ],
});

sdk.start();
