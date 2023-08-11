import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import {Cell, toNano, TupleBuilder} from 'ton-core';
import { Task1 } from '../wrappers/Task1';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';

describe('Task1', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Task1');
    });

    let blockchain: Blockchain;
    let task1: SandboxContract<Task1>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        task1 = blockchain.openContract(Task1.createFromConfig({}, code));

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await task1.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: task1.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and task1 are ready to use

        const tb = new TupleBuilder()
        //tb.writeNumber(BigInt("112217716449989047460221684632076053244058804272382489846864958003834180757136"));
        //tb.writeCell(Cell.fromBoc(Buffer.from("B5EE9C7201024201000145000300010102030003030300020803000404040300050505030006060603000707070300080808030009090903000A0A0A03000B0B0B03000C0C0C03000D0D0D03000E0E0E03000F0F0F030010101003001111110300121212030013131303001414140300151515030016161603001717170300181818030019191903001A1A1A03001B1B1B03001C1C1C03001D1D1D03001E1E1E03001F1F1F030020202003002121210300222222030023232303002424240300252525030026262603002727270300282828030029292903002A2A2A03002B2B2B03002C2C2C03002D2D2D03002E2E2E03002F2F2F030030303003003131310300323232030033333303003434340300353535030036363603003737370300383838030039393903003A3A3A03003B3B3B03003C3C3C03003D3D3D03003E3E3E03003F3F3F030040404003004141410000", "hex"))[0]);
        //const r = await blockchain.runGetMethod(task1.address, "find_branch_by_hash", tb.build())
        const r = await blockchain.runGetMethod(task1.address, "get_zero_hash", tb.build())

        console.log(r.gasUsed)
        console.log(r.stack)
    });
});
