import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { AnyFieldApi } from "@tanstack/react-form";

interface CustomInputFieldProps {
    field: AnyFieldApi;
    label: string;
    children?: React.ReactNode;
}

const CustomInputField = ({
    field,
    label,
    children
}: CustomInputFieldProps) => {
    return (
        <div className="space-y-2">
            <Label
                htmlFor={field.name}
                className={cn(
                    "font-semibold",
                    !field.state.meta.isValid && "text-red-500"
                )}
            >
                {label}
            </Label>
            {children}
            {!field.state.meta.isValid && (
                <p className="text-red-500 text-sm -mt-1.5">
                    {field.state.meta.errors[0]?.message}
                </p>
            )}
        </div>
    );
};

export default CustomInputField;
