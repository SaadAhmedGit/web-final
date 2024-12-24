import amqp from "amqplib";

let channel: amqp.Channel = null;
let connection: amqp.Connection = null;
const submissionQueue = "submission_queue";
const rpcQueue = "rpc_queue";
try {
	connection = await amqp.connect("amqp://127.0.0.1:5672");
	channel = await connection.createChannel();
	channel.assertQueue(submissionQueue, { durable: true });
	channel.assertQueue(rpcQueue, { durable: false, exclusive: true });
} catch (error) {
	console.log(error);
}

export default channel;
export { submissionQueue, rpcQueue, connection };
