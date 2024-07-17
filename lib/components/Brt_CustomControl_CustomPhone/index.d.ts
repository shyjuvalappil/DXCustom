import type { PConnFieldProps } from './PConnProps';
interface BrtCustomControlCustomPhoneProps extends PConnFieldProps {
    displayAsStatus?: boolean;
    isTableFormatter?: boolean;
    hasSuggestions?: boolean;
    variant?: any;
    formatter: string;
    datasource: Array<any>;
    showCountryCode: boolean;
}
export declare const formatExists: (formatterVal: string) => boolean;
export declare const textFormatter: (formatter: string, value: any) => any;
declare const _default: (props: BrtCustomControlCustomPhoneProps) => JSX.Element;
export default _default;
//# sourceMappingURL=index.d.ts.map