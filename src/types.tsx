
interface Changeable<ValueType> {
    value: ValueType
    onChange: (value: ValueType) => void
}

interface Focusable {
    onFocus: () => void
    onBlur: () => void
}

interface Filterable<DataType> {
    data: DataType
    onResult: (result: DataType) => void
}

interface Selectable<CollectionType> {
    onSelect: (selected: CollectionType) => void
    data: CollectionType
}

interface Clearable {
    onClear: () => void
    clear: () => void
}

interface Showable {
    onShow: () => void
    onHide: () => void
    isShow: boolean
    setShow: (show: boolean) => void
}

interface Wrappable<Wrapper extends Showable, Children> {
    connect: (wrapper: Wrapper) => (children: Children) => Wrapper & Children
}

interface OnFocusShow<Focus extends Focusable, Content extends Showable> {
    connect: (focus: Focus) => (content: Content) => Showable
}

interface SelectChangeable<DataSet> {
    connect: (select: Selectable<DataSet>) => (change:Changeable<DataSet>) => Changeable<DataSet> & Selectable<DataSet>
}

type Input = Changeable<string> & Focusable

type AutoComplete = Input & Filterable<[string]>


