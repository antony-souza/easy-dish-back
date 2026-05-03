import { QueueService } from "./queue.service.js";
import { QueueNamesUtils } from "./queues-names.utils.js";

type ConsumerConfig<T> = {
    queueName: QueueNamesUtils;
    handler: (data: T) => Promise<void>;
};

const consumers: ConsumerConfig<unknown>[] = [];

export async function startAllConsumers(): Promise<void> {
    await Promise.all(
        consumers.map(({ queueName, handler }) => QueueService.consumeQueue(queueName, handler))
    );
}