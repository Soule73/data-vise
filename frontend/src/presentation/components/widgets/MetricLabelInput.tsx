import InputField from "@components/forms/InputField";

interface MetricLabelInputProps {
    value: string;
    onChange: (value: string) => void;
    name: string;
    id: string;
    metricIndex: number;
}

export default function MetricLabelInput({
    value,
    onChange,
    name,
    id,
    metricIndex,
}: MetricLabelInputProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        console.log(`[DEBUG] Direct input change for metric ${metricIndex}: "${value}" -> "${newValue}"`);
        onChange(newValue);
    };

    return (
        <InputField
            label="Label"
            value={value || ""}
            onChange={handleChange}
            name={name}
            id={id}
        />
    );
}
