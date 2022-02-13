interface LoggerParams {
    type?: "log" | "trace" | "warn" | "info" | "debug";
    inputs?: boolean;
    outputs?: boolean;
}

const defaultParams: Required<LoggerParams> = {
    type: "debug",
    inputs: true,
    outputs: true,
};

export function Log(params?: LoggerParams) {
    const options: Required<LoggerParams> = {
        type: params?.type || defaultParams.type,
        inputs:
            params?.inputs === undefined ? defaultParams.inputs : params.inputs,
        outputs:
            params?.outputs === undefined
                ? defaultParams.outputs
                : params.outputs,
    };

    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        const original = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            if (options.inputs) {
                console[options.type](`[LOG][${propertyKey}]`, args);
            }

            const result = original.apply(this, args);

            if (result instanceof Promise) {
                const promiseResult = await result;
                console[options.type](`[LOG][${propertyKey}]`, promiseResult);
            } else {
                console[options.type](`[LOG][${propertyKey}]`, result);
            }

            return result;
        };
    };
}
