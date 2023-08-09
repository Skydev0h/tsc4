import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import {Builder, Cell, toNano, TupleBuilder} from 'ton-core';
import { Task5 } from '../wrappers/Task5';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';

describe('Task5', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Task5');
    });

    let blockchain: Blockchain;
    let task5: SandboxContract<Task5>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        task5 = blockchain.openContract(Task5.createFromConfig({}, code));

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await task5.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: task5.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and task5 are ready to use

        console.log((await blockchain.runGetMethod(task5.address, "fibonacci_sequence", [
            {type: "int", value: BigInt(1)},
            {type: "int", value: BigInt(3)}
        ])).stackReader.readTuple())

        console.log((await blockchain.runGetMethod(task5.address, "fibonacci_sequence", [
            {type: "int", value: BigInt(201)},
            {type: "int", value: BigInt(4)}
        ])).stackReader.readTuple())

        console.log((await blockchain.runGetMethod(task5.address, "fibonacci_sequence", [
            {type: "int", value: BigInt(0)},
            {type: "int", value: BigInt(0)}
        ])).stackReader.readTuple())

        console.log((await blockchain.runGetMethod(task5.address, "fibonacci_sequence", [
            {type: "int", value: BigInt(0)},
            {type: "int", value: BigInt(1)}
        ])).stackReader.readTuple())

        console.log((await blockchain.runGetMethod(task5.address, "fibonacci_sequence", [
            {type: "int", value: BigInt(1)},
            {type: "int", value: BigInt(0)}
        ])).stackReader.readTuple())

        console.log((await blockchain.runGetMethod(task5.address, "fibonacci_sequence", [
            {type: "int", value: BigInt(0)},
            {type: "int", value: BigInt(255)}
        ])).stackReader.readTuple())

        console.log((await blockchain.runGetMethod(task5.address, "fibonacci_sequence", [
            {type: "int", value: BigInt(115)},
            {type: "int", value: BigInt(255)}
        ])).stackReader.readTuple())

        console.log((await blockchain.runGetMethod(task5.address, "fibonacci_sequence", [
            {type: "int", value: BigInt(370)},
            {type: "int", value: BigInt(1)}
        ])).stackReader.readTuple())
    });
});
