import { Utils }                 from './common/utils';
import { TransactionFlow }       from './core/transaction-flow';
import { LegacyTransactionFlow } from './legacy/transaction-flow.legacy';

const transactionFlow = new TransactionFlow();
const legacyTransactionFlow = new LegacyTransactionFlow();

export function main() {
    const flowType = Utils.getRunArgument('flow');
    const legacy = Utils.getRunArgument('useLegacy');
    if (legacy === 'true') {
        legacyTransactionFlow.runFlow(flowType);
    } else {
        transactionFlow.runFlow(flowType);
    }
}

main();
