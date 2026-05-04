import { SmtpService } from "../smtp/smtp.service.js";
import { QueueService } from "./queue.service.js";
import { QueueNamesUtils } from "./queues-names.utils.js";

type ConsumerConfig<T extends QueueNamesUtils> = {
    queueName: T;
    handler: (data: QueuePayloadMap[T]) => Promise<void>;
};

export type QueuePayloadMap = {
    [QueueNamesUtils.SEND_EMAIL]: {emailToSend: string, code: string}
}

const consumers: ConsumerConfig<QueueNamesUtils>[] = [
    {
        queueName: QueueNamesUtils.SEND_EMAIL, 
        handler: async (data) => {
            const smpt = new SmtpService()
            await smpt.sendMail({
                to: data.emailToSend,
                subject: "Verificação de e-mail",
                html: `<h1>Verificação de email</h1>
				    <p>Caso esta ação não tenha sido realizada por você, apenas ignore este e-mail</p>
                    <p>Código: <code>${data.code}</code></p>`
            })
        },
    }
];

export async function startAllConsumers(): Promise<void> {
    await Promise.all(
        consumers.map(({ queueName, handler }) => QueueService.consumeQueue(queueName, handler))
    );
}