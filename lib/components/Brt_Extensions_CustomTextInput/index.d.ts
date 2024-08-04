/// <reference types="react" />
import type { PConnFieldProps } from './PConnProps';
interface BrtExtensionsCustomTextInputProps extends PConnFieldProps {
    displayAsStatus?: boolean;
    isTableFormatter?: boolean;
    hasSuggestions?: boolean;
    variant?: any;
    formatter: string;
    length?: number;
}
export declare const formatExists: (formatterVal: string) => boolean;
export declare const textFormatter: (formatter: string, value: string) => any;
declare const _default: (props: BrtExtensionsCustomTextInputProps) => JSX.Element;
export default _default;
//# sourceMappingURL=index.d.ts.map