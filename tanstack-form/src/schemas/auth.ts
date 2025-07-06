import * as v from "valibot";

export const SignupSchema = v.pipe(
    v.object({
        name: v.pipe(
            v.string(),
            v.trim(),
            v.nonEmpty("Please provide a name"),
            v.minLength(2, "Name must be at least 2 characters long")
        ),
        username: v.pipe(
            v.string(),
            v.trim(),
            v.nonEmpty("Please provide a username"),
            v.minLength(3, "Username must be at least 3 characters long"),
            v.regex(
                /^[a-zA-Z0-9-]+$/,
                "Username can only contain letters, numbers, and hyphens"
            )
        ),
        email: v.pipe(
            v.string(),
            v.trim(),
            v.nonEmpty("Please provide an email address"),
            v.email("Please provide a valid email address")
        ),
        password: v.pipe(
            v.string(),
            v.trim(),
            v.nonEmpty("Please provide a password"),
            v.minLength(8, "Password must be at least 8 characters long")
        ),
        confirmPassword: v.pipe(
            v.string(),
            v.trim(),
            v.nonEmpty("Please confirm your password")
        ),
        skills: v.pipe(
            v.array(
                v.object({
                    id: v.string(),
                    name: v.pipe(
                        v.string(),
                        v.nonEmpty("Please provide the skill name")
                    ),
                    rating: v.pipe(v.number())
                })
            ),
            v.nonEmpty("You must include at least 5 skills")
        )
    }),
    v.forward(
        v.partialCheck(
            [["password"], ["confirmPassword"]],
            (input) => input.password === input.confirmPassword,
            "Passwords do not match"
        ),
        ["confirmPassword"]
    )
);

export type SignupSchema = v.InferOutput<typeof SignupSchema>;
