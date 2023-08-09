import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import {BitString, Builder, Cell, toNano, TupleBuilder} from 'ton-core';
import { Task3 } from '../wrappers/Task3';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';

describe('Task3', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Task3');
    });

    let blockchain: Blockchain;
    let task3: SandboxContract<Task3>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        task3 = blockchain.openContract(Task3.createFromConfig({}, code));

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await task3.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: task3.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and task3 are ready to use

        const tb = new TupleBuilder()
        tb.writeNumber(0b101110101);
        tb.writeNumber(0b111111111);
        tb.writeCell((new Builder()).storeUint(0, 256).storeUint(0, 256).storeUint(0, 256).storeUint(0, 231).
        storeUint(0b000101010101010100001011, 24).storeRef(
            (new Builder()).storeUint(0b101010001111110101010101, 24)
        ).asCell())

        const r = await blockchain.runGetMethod(task3.address, "find_and_replace", tb.build())

        let rc: Cell|null = r.stackReader.readCell()
        console.log(r.gasUsed.toString())
        console.log(rc.toString())
        while (rc != null) {
            let s = "";
            const b = rc.bits;
            for (let i = 0; i < b.length; i++) {
                s += b.at(i) ? "1" : "0";
            }
            console.log(s);
            if (rc.refs.length != 0)
                rc = rc.refs[0];
            else
                rc = null;
        }
    });
});
