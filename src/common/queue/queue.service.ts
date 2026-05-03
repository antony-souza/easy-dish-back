import amqp from "amqplib";
import type { ChannelModel, Channel } from "amqplib";
import { getEnvField } from "../../config/env.config.js";
import type { QueueNamesUtils } from "./queues-names.utils.js";

export class QueueService {
  private static connection: ChannelModel | null = null;
  private static channel: Channel | null = null;

  static async connectQueue(): Promise<void> {
    if (this.connection && this.channel) return;

    this.connection = await amqp.connect(this.amqpUrl());
    this.channel = await this.connection.createChannel();

    this.connection.on("error", (err) => {
      console.error("[RabbitMQ] Connection error:", err.message);
      this.connection = null;
      this.channel = null;
    });

    this.connection.on("close", () => {
      console.warn("[RabbitMQ] Connection closed unexpectedly");
      this.connection = null;
      this.channel = null;
    });
  }

  static getChannel(): Channel {
    if (!this.channel) {
      throw new Error("Channel not initialized. Call QueueService.connectQueue() first.");
    }

    return this.channel;
  }

  static async addToQueue<T>(queueName: QueueNamesUtils, data: T): Promise<void> {
    const channel = this.getChannel();

    await channel.assertQueue(queueName, { durable: true });

    const sent = channel.sendToQueue(
      queueName,
      Buffer.from(JSON.stringify(data)),
      { persistent: true, contentType: "application/json" }
    );

    if (!sent) {
      throw new Error(`[RabbitMQ] Failed to send message to queue "${queueName}": write buffer is full`);
    }
  }

  static async consumeQueue<T>(
    queueName: QueueNamesUtils,
    handler: (data: T) => Promise<void>
  ): Promise<void> {
    const channel = this.getChannel();

    await channel.assertQueue(queueName, { durable: true });
    channel.prefetch(1);

    await channel.consume(queueName, async (msg) => {
      if (!msg) return;

      try {
        const data: T = JSON.parse(msg.content.toString());
        await handler(data);
        channel.ack(msg);
      } catch (err) {
        console.error(`[RabbitMQ] Error processing message from "${queueName}":`, err);
        channel.nack(msg, false, false);
      }
    });
  }

  static async closeQueue(): Promise<void> {
    try {
      await this.channel?.close();
      await this.connection?.close();
    } catch (err) {
      console.error("[RabbitMQ] Error while closing connection:", err);
    } finally {
      this.channel = null;
      this.connection = null;
    }
  }

  private static amqpUrl(): string {
    const host = getEnvField.RABBITMQ_HOST;
    const port = getEnvField.RABBITMQ_PORT;
    const user = encodeURIComponent(getEnvField.RABBITMQ_USER);
    const pass = encodeURIComponent(getEnvField.RABBITMQ_PASSWORD);
    return `amqp://${user}:${pass}@${host}:${port}`;
  }
}
