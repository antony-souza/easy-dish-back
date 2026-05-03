import { startAllConsumers } from "./common/queue/queue-consumer.js";
import { QueueService } from "./common/queue/queue.service.js";
import { getEnvField } from "./config/env.config.js";

export async function startBootstrapUtils() {

    if (getEnvField.QUEUE_ENABLED === true) {
        await QueueService.connectQueue();
    }

    if (getEnvField.QUEUE_CONSUMERS_ENABLED === true) {
        await startAllConsumers();
    }
}