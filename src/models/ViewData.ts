
export interface ViewData<Value> {
    value: Value
    map: <mValue>(f: (Value) => mValue) => ViewData<mValue>
}

export type OnChange<Value> = (Value) => void

export interface OnChangeTrigger<Value> {
    wrapped: OnChange<Value>
    map: <mValue>(f: ((Value) => mValue)) => OnChangeTrigger<mValue>
}