import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import {Builder, Cell, toNano, TupleBuilder} from 'ton-core';
import { Task4 } from '../wrappers/Task4';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';

// @ts-ignore
BigInt.prototype.toJSON = function() { return this.toString() }

describe('Task4', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Task4');
    });

    let blockchain: Blockchain;
    let task4: SandboxContract<Task4>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        task4 = blockchain.openContract(Task4.createFromConfig({}, code));

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await task4.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: task4.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and task4 are ready to use

        const tb = new TupleBuilder()
        tb.writeNumber(4)
        tb.writeCell((new Builder()).storeStringTail("abcdef").storeRef(
            (new Builder()).storeStringTail("ABCDEF")
        ).asCell())

        const r = await blockchain.runGetMethod(task4.address, "caesar_cipher_encrypt", tb.build())

        const rc = r.stackReader.readCell()
        console.log(rc)

        const tb2 = new TupleBuilder()
        tb2.writeNumber(4)
        tb2.writeCell(rc)

        const r2 = await blockchain.runGetMethod(task4.address, "caesar_cipher_decrypt", tb2.build())
        const rc2: Cell = r2.stackReader.readCell()
        console.log(rc2)
    });
});
