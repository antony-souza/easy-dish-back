import { runShakaPackager } from "./consumers/run-shaka-packager.js";
import { QueueService } from "./queue.service.js";
import { QueueNamesUtils } from "./queues-names.utils.js";

type ConsumerConfig = {
    queueName: QueueNamesUtils;
    handler: (data: any) => Promise<void>;
};

const consumers: ConsumerConfig[] = [
    {
        queueName: QueueNamesUtils.shaka_packager,
        handler: runShakaPackager(),
    }
];

export async function startAllConsumers(): Promise<void> {
    await Promise.all(
        consumers.map(({ queueName, handler }) => QueueService.consumeQueue(queueName, handler))
    );
}