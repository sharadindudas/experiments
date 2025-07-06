import { useForm, useStore } from "@tanstack/react-form";
import CustomInputField from "./components/common/custom-input-field";
import { SignupSchema } from "./schemas/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Check, Eye, Loader2, X } from "lucide-react";

const sleep = (timeout: number) =>
    new Promise((resolve) => setTimeout(resolve, timeout));

function App() {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] =
        useState<boolean>(false);
    const [usernameCheckState, setUsernameCheckState] = useState<{
        isChecking: boolean;
        isUnique: boolean | null;
        lastCheckedUsername: string;
    }>({
        isChecking: false,
        isUnique: null,
        lastCheckedUsername: ""
    });

    const form = useForm({
        defaultValues: {
            name: "",
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            skills: []
        } as SignupSchema,
        validators: {
            onSubmit: SignupSchema
        },

        onSubmit: async ({ value, formApi }) => {
            await sleep(1000);
            console.log(value);
            formApi.reset();
        }
    });

    const password = useStore(form.store, (state) => state.values.password);
    const confirmPassword = useStore(
        form.store,
        (state) => state.values.confirmPassword
    );

    const checkUsernameUniqueness = async (
        username: string
    ): Promise<boolean> => {
        await sleep(500);
        const takenUsernames = ["test", "admin", "user", "demo"];
        return !takenUsernames.includes(username.toLowerCase());
    };

    const handleUsernameCheck = async (username: string) => {
        if (username === usernameCheckState.lastCheckedUsername) {
            return;
        }

        setUsernameCheckState((prev) => ({ ...prev, isChecking: true }));
        try {
            const isUnique = await checkUsernameUniqueness(username);
            setUsernameCheckState({
                isChecking: false,
                isUnique,
                lastCheckedUsername: username
            });
        } catch (err) {
            console.error("Error checking username:", err);
            setUsernameCheckState({
                isChecking: false,
                isUnique: null,
                lastCheckedUsername: username
            });
        }
    };

    return (
        <div className="min-h-screen max-w-md mx-auto py-10">
            <h1 className="text-center font-bold text-3xl mb-3">
                Tanstack Form
            </h1>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                }}
                className="space-y-5"
            >
                <form.Field
                    name="name"
                    listeners={{
                        onChangeDebounceMs: 500,
                        onChange: ({ value }) => {
                            const username = value
                                ?.toLowerCase()
                                .split(" ")
                                .join("-");
                            form.setFieldValue("username", username);
                            handleUsernameCheck(username);
                        }
                    }}
                >
                    {(field) => (
                        <CustomInputField label="Name *" field={field}>
                            <Input
                                id={field.name}
                                name={field.name}
                                type="text"
                                value={field.state.value}
                                onChange={(e) =>
                                    field.handleChange(e.target.value)
                                }
                                onBlur={field.handleBlur}
                                autoComplete="on"
                                placeholder="Enter your Name"
                                className={cn(
                                    "bg-white rounded-sm h-12 text-black text-sm focus-visible:border-black",
                                    !field.state.meta.isValid &&
                                        "border-red-500 focus-visible:border focus-visible:border-red-500"
                                )}
                            />
                        </CustomInputField>
                    )}
                </form.Field>

                <form.Field
                    name="username"
                    listeners={{
                        onChangeDebounceMs: 800,
                        onChange: ({ value }) => {
                            if (value && value.length >= 3) {
                                handleUsernameCheck(value);
                            } else {
                                setUsernameCheckState({
                                    isChecking: false,
                                    isUnique: null,
                                    lastCheckedUsername: ""
                                });
                            }
                        }
                    }}
                >
                    {(field) => (
                        <CustomInputField label="Username *" field={field}>
                            <div className="relative">
                                <Input
                                    id={field.name}
                                    name={field.name}
                                    type="text"
                                    value={field.state.value}
                                    onChange={(e) =>
                                        field.handleChange(e.target.value)
                                    }
                                    onBlur={field.handleBlur}
                                    autoComplete="on"
                                    placeholder="Enter your Username"
                                    className={cn(
                                        "bg-white rounded-sm h-12 text-black text-sm focus-visible:border-black",
                                        !field.state.meta.isValid &&
                                            "border-red-500 focus-visible:border focus-visible:border-red-500"
                                    )}
                                />
                                {field.state.value.length >= 3 && (
                                    <div className="absolute top-1/2 -translate-y-1/2 right-3">
                                        {usernameCheckState.isChecking ? (
                                            <Loader2
                                                size={16}
                                                className="animate-spin text-gray-500"
                                            />
                                        ) : usernameCheckState.isUnique ===
                                          true ? (
                                            <Check
                                                size={16}
                                                className="text-green-500"
                                            />
                                        ) : usernameCheckState.isUnique ===
                                          false ? (
                                            <X
                                                size={16}
                                                className="text-red-500"
                                            />
                                        ) : null}
                                    </div>
                                )}
                            </div>
                        </CustomInputField>
                    )}
                </form.Field>

                <form.Field name="email">
                    {(field) => (
                        <CustomInputField label="Email *" field={field}>
                            <Input
                                id={field.name}
                                name={field.name}
                                type="email"
                                value={field.state.value}
                                onChange={(e) =>
                                    field.handleChange(e.target.value)
                                }
                                onBlur={field.handleBlur}
                                autoComplete="on"
                                placeholder="Enter your Email"
                                className={cn(
                                    "bg-white rounded-sm h-12 text-black text-sm focus-visible:border-black",
                                    !field.state.meta.isValid &&
                                        "border-red-500 focus-visible:border focus-visible:border-red-500"
                                )}
                            />
                        </CustomInputField>
                    )}
                </form.Field>

                <form.Field name="password">
                    {(field) => (
                        <CustomInputField label="Password *" field={field}>
                            <div className="relative">
                                <Input
                                    id={field.name}
                                    name={field.name}
                                    type={showPassword ? "text" : "password"}
                                    value={field.state.value}
                                    onChange={(e) =>
                                        field.handleChange(e.target.value)
                                    }
                                    onBlur={field.handleBlur}
                                    autoComplete="on"
                                    placeholder="Enter your Password"
                                    className={cn(
                                        "bg-white rounded-sm h-12 text-black text-sm focus-visible:border-black",
                                        !field.state.meta.isValid &&
                                            "border-red-500 focus-visible:border focus-visible:border-red-500"
                                    )}
                                />
                                {password && (
                                    <Eye
                                        size={20}
                                        className="cursor-pointer absolute top-1/2 -translate-y-1/2 right-4"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                    />
                                )}
                            </div>
                        </CustomInputField>
                    )}
                </form.Field>

                <form.Field name="confirmPassword">
                    {(field) => (
                        <CustomInputField
                            label="Confirm Password *"
                            field={field}
                        >
                            <div className="relative">
                                <Input
                                    id={field.name}
                                    name={field.name}
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={field.state.value}
                                    onChange={(e) =>
                                        field.handleChange(e.target.value)
                                    }
                                    onBlur={field.handleBlur}
                                    autoComplete="on"
                                    placeholder="Enter your Confirm Password"
                                    className={cn(
                                        "bg-white rounded-sm h-12 text-black text-sm focus-visible:border-black",
                                        !field.state.meta.isValid &&
                                            "border-red-500 focus-visible:border focus-visible:border-red-500"
                                    )}
                                />
                                {confirmPassword && (
                                    <Eye
                                        size={20}
                                        className="cursor-pointer absolute top-1/2 -translate-y-1/2 right-4"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword
                                            )
                                        }
                                    />
                                )}
                            </div>
                        </CustomInputField>
                    )}
                </form.Field>

                <form.Field name="skills" mode="array">
                    {(field) => (
                        <CustomInputField label="Skills *" field={field}>
                            <div className="space-y-4">
                                {field.state.value.length > 0 &&
                                    field.state.value.map((skill, index) => {
                                        return (
                                            <div
                                                key={skill.id}
                                                className="flex items-start gap-3 p-4 border rounded-lg bg-gray-50"
                                            >
                                                <div className="flex-1 space-y-3">
                                                    <form.Field
                                                        name={`skills[${index}].name`}
                                                    >
                                                        {(subField) => (
                                                            <CustomInputField
                                                                label="Skill Name *"
                                                                field={subField}
                                                            >
                                                                <Input
                                                                    id={
                                                                        subField.name
                                                                    }
                                                                    name={
                                                                        subField.name
                                                                    }
                                                                    type="text"
                                                                    value={
                                                                        subField
                                                                            .state
                                                                            .value
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        subField.handleChange(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                    onBlur={
                                                                        subField.handleBlur
                                                                    }
                                                                    autoComplete="on"
                                                                    placeholder="Enter your Skill Name"
                                                                    className={cn(
                                                                        "bg-white rounded-sm h-12 text-black text-sm focus-visible:border-black",
                                                                        !subField
                                                                            .state
                                                                            .meta
                                                                            .isValid &&
                                                                            "border-red-500 focus-visible:border focus-visible:border-red-500"
                                                                    )}
                                                                />
                                                            </CustomInputField>
                                                        )}
                                                    </form.Field>

                                                    <form.Field
                                                        name={`skills[${index}].rating`}
                                                    >
                                                        {(subField) => (
                                                            <CustomInputField
                                                                label="Skill Ratings *"
                                                                field={subField}
                                                            >
                                                                <Input
                                                                    id={
                                                                        subField.name
                                                                    }
                                                                    name={
                                                                        subField.name
                                                                    }
                                                                    type="number"
                                                                    min="1"
                                                                    max="10"
                                                                    value={
                                                                        subField
                                                                            .state
                                                                            .value ||
                                                                        ""
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        subField.handleChange(
                                                                            Number(
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                        )
                                                                    }
                                                                    onBlur={
                                                                        subField.handleBlur
                                                                    }
                                                                    autoComplete="on"
                                                                    placeholder="Enter your Skill Ratings (1-10)"
                                                                    className={cn(
                                                                        "bg-white rounded-sm h-12 text-black text-sm focus-visible:border-black",
                                                                        !subField
                                                                            .state
                                                                            .meta
                                                                            .isValid &&
                                                                            "border-red-500 focus-visible:border focus-visible:border-red-500"
                                                                    )}
                                                                />
                                                            </CustomInputField>
                                                        )}
                                                    </form.Field>
                                                </div>

                                                {/* Remove button */}
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        field.removeValue(index)
                                                    }
                                                    className="mt-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                >
                                                    <X size={16} />
                                                </Button>
                                            </div>
                                        );
                                    })}
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        field.pushValue({
                                            id: crypto.randomUUID(),
                                            name: "",
                                            rating: 0
                                        });
                                    }}
                                    className="w-full h-12"
                                >
                                    Add Skill
                                </Button>
                            </div>
                        </CustomInputField>
                    )}
                </form.Field>

                <form.Subscribe
                    selector={(state) => [
                        state.isValid,
                        state.isDirty,
                        state.isSubmitting
                    ]}
                >
                    {([isValid, isDirty, isSubmitting]) => {
                        return (
                            <Button
                                type="submit"
                                className="w-full h-12"
                                disabled={!isValid || !isDirty || isSubmitting}
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="animate-spin" />
                                        Submitting...
                                    </div>
                                ) : (
                                    "Submit"
                                )}
                            </Button>
                        );
                    }}
                </form.Subscribe>
            </form>
        </div>
    );
}

export default App;
