import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import {Cell, toNano, TupleItem} from 'ton-core';
import { Task2 } from '../wrappers/Task2';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';

describe('Task2', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Task2');
    });

    let blockchain: Blockchain;
    let task2: SandboxContract<Task2>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        task2 = blockchain.openContract(Task2.createFromConfig({}, code));

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await task2.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: task2.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and task2 are ready to use

        const t = (...items: number[]): TupleItem => {
            return {type: "tuple", items: items.map((v: number): TupleItem => { return {type: "int", value: BigInt(v)} })};
        }

        const r = (await blockchain.runGetMethod(task2.address, "matrix_multiplier", [
            {type: "tuple", items: [
                t(10, 11),
                t(12, 13),
                t(14, 15)
            ]},
            {type: "tuple", items: [
                t(1, 2, 3, 4),
                t(5, 6, 7, 8)
            ]},
        ]));
        const rdr = r.stackReader.readTuple()
        while (rdr.remaining > 0) {
            console.log(rdr.readTuple());
        }
        console.log(r.gasUsed);
    });
});
