import { RichTypeAny } from "core/FlowGraph/flowGraphRichTypes";
import { FlowGraphExecutionBlockWithOutSignal } from "../../flowGraphWithOnDoneExecutionBlock";
import type { FlowGraphContext } from "../../flowGraphContext";
import { RegisterClass } from "../../../Misc/typeStore";
import type { IFlowGraphBlockConfiguration } from "../../flowGraphBlock";

/**
 * @experimental
 * Parameters used to create a FlowGraphSendCustomEventBlock.
 */
export interface IFlowGraphSendCustomEventBlockConfiguration extends IFlowGraphBlockConfiguration {
    /**
     * The id of the event to send.
     */
    eventId: string;
    /**
     * The names of the data inputs for that event.
     */
    eventData: string[];
}
/**
 * @experimental
 */
export class FlowGraphSendCustomEventBlock extends FlowGraphExecutionBlockWithOutSignal {
    public constructor(public config: IFlowGraphSendCustomEventBlockConfiguration) {
        super(config);
    }

    public configure(): void {
        super.configure();
        for (let i = 0; i < this.config.eventData.length; i++) {
            const dataName = this.config.eventData[i];
            this.registerDataInput(dataName, RichTypeAny);
        }
    }

    public _execute(context: FlowGraphContext): void {
        const eventId = this.config.eventId;
        const eventDatas = this.dataInputs.map((port) => port.getValue(context));

        context.configuration.coordinator.notifyCustomEvent(eventId, eventDatas);

        this.out._activateSignal(context);
    }

    public getClassName(): string {
        return FlowGraphSendCustomEventBlock.ClassName;
    }

    public static ClassName = "FGSendCustomEventBlock";
}
RegisterClass("FGSendCustomEventBlock", FlowGraphSendCustomEventBlock);
